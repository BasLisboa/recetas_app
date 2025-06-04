// controllers/nutricional.controller.cjs

/**
 * Controlador para calcular los valores nutricionales
 * (calorías, proteínas y grasas) de una receta completa,
 * dado su ID.
 *
 * Ahora IGNORAMOS el campo `valores_nutricionales.cantidad`.
 * Siempre tomamos como base 100 g.
 */

const db = require("../config/db.cjs");

/**
 * Función HTTP que responde a GET /api/nutricional/:id
 */
async function obtenerValoresNutricionales(req, res) {
  // 1) Validar y parsear el ID de receta
  const idReceta = parseInt(req.params.id, 10);
  if (isNaN(idReceta)) {
    return res.status(400).json({ message: "ID de receta inválido." });
  }

  try {
    // 2) Query para obtener:
    //    - i.id_ingrediente, i.nombre_ingrediente
    //    - ri.cantidad    → número de unidades en receta_ingrediente
    //    - um.peso_en_gramos → cuántos gramos equivale cada unidad
    //    - vn.calorias, vn.proteinas, vn.grasas  → valores nutricionales POR 100 g
    //
    // Nota: ya NO traemos vn.cantidad porque lo ignoramos y usamos base fija de 100 g.
    const sql = `
      SELECT
        i.id_ingrediente,
        CONCAT(UPPER(LEFT(i.nombre_ingrediente, 1)),LOWER(SUBSTRING(i.nombre_ingrediente, 2))) AS nombre_ingrediente,
        ri.cantidad               AS cantidad_unidades,   -- ej. “2” tazas, “1” cuchara, etc.
        um.medida                 AS unidad_medida,     -- ej. “taza”, “cucharada”
        um.medida_plural          AS unidad_medida_plural, -- ej. “tazas”, “cucharadas”
        um.peso_en_gramos         AS peso_unitario,       -- ej. 240 (g por cada taza)
        vn.calorias               AS cal_base,            -- calorías POR 100 g
        vn.proteinas              AS prot_base,           -- proteínas POR 100 g
        vn.grasas                 AS gras_base            -- grasas POR 100 g
      FROM receta_ingrediente ri
      JOIN ingredientes i
        ON ri.id_ingrediente = i.id_ingrediente
      JOIN unidad_de_medida um
        ON ri.id_medida = um.id_medida
      JOIN valores_nutricionales vn
        ON vn.id_ingrediente = i.id_ingrediente
      WHERE ri.id_recetas = ?                     -- usar “id_recetas” según tu esquema actual
    `;
    const [rows] = await db.query(sql, [idReceta]);

    // 3) Si no hay filas, devolvemos 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron ingredientes para esa receta." });
    }

    // 4) Inicializar acumuladores
    let totalPeso       = 0;   // suma de gramos de todos los ingredientes
    let totalCalorias   = 0;   // suma de calorías totales
    let totalProteinas  = 0;   // suma de proteínas totales
    let totalGrasas     = 0;   // suma de grasas totales

    // 5) Procesar cada ingrediente y calcular su contribución
    const detalleIngredientes = rows.map((fila) => {
      // 5.1) Convertir a números
      const unidadesUsadas   = parseFloat(fila.cantidad_unidades);   // ej. “2” tazas
      const gramosPorUnidad  = parseFloat(fila.peso_unitario);       // ej. 240 g/taza
      const calBase          = parseFloat(fila.cal_base);            // calorías POR 100 g
      const protBase         = parseFloat(fila.prot_base);           // proteínas POR 100 g
      const grasBase         = parseFloat(fila.gras_base);           // grasas POR 100 g

      // 5.2) Calcular peso real en gramos que se está usando
      //       ej. si unidadesUsadas = 2 (tazas) y gramosPorUnidad = 240, entonces pesoUsado = 480 g
      const pesoUsado = unidadesUsadas * gramosPorUnidad;

      // 5.3) Evitar división por cero (siempre dividimos POR 100 g, pero aseguramos pesoUsado ≥ 0)
      //       Aquí la “base” fija para vn.calorias/prot_base/gras_base es 100 g
      const factor = pesoUsado > 0 ? pesoUsado / 100 : 0;

      // 5.4) Calcular contribución nutricional de este ingrediente
      const calContrib   = parseFloat((factor * calBase).toFixed(2));  // ej. 4.8 * 130 = 624.00
      const protContrib  = parseFloat((factor * protBase).toFixed(2));
      const grasContrib  = parseFloat((factor * grasBase).toFixed(2));

      let nombre_medida; // Variable para el nombre de la unidad de medida
      if (unidadesUsadas > 1) {
        nombre_medida = fila.unidad_medida_plural
      }else{
        nombre_medida = fila.unidad_medida;
      };
      // 5.5) Acumular totales
      totalPeso       += pesoUsado;
      totalCalorias   += calContrib;
      totalProteinas  += protContrib;
      totalGrasas     += grasContrib;

      // 5.6) Devolver objeto con la misma estructura que esperaba el front-end
      return {
        id_ingrediente: fila.id_ingrediente,
        nombre_ingrediente: fila.nombre_ingrediente,
        cantidad_ing: fila.cantidad_unidades,
        unidad_medida: nombre_medida, // cantidad en unidades (ej. “2” tazas
        // “cantidad_usada” ahora es el peso EN GRAMOS que se usa realmente
        cantidad_usada: parseFloat(pesoUsado.toFixed(2)),
        // “base_cantidad” lo dejamos igual para que el front no cambie (aunque ya no se use):
        // si quieres, podríamos seguir enviando “100” para que quede claro que la base es 100 g.
        base_cantidad: 100,
        macros_por_base: {
          calorias: calBase,
          proteinas: protBase,
          grasas: grasBase
        },
        contribucion: {
          calorias: calContrib,
          proteinas: protContrib,
          grasas: grasContrib
        }
      };
    });

    // 6) Si la suma total de gramos es 0, devolvemos error
    if (totalPeso === 0) {
      return res.status(400).json({ message: "El peso total de la receta es cero." });
    }

    // 7) Calcular valores normalizados POR CADA 100 g de receta
    //    (totalCalorias / totalPeso) * 100, etc.
    const factorNorm = 100.0 / totalPeso;
    const val100g = {
      calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
      proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
      grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
    };

    // 8) Construir respuesta final en el MISMO formato que antes
    const resultado = {
      id_receta: idReceta,
      detalle_ingredientes: detalleIngredientes,
      totales: {
        totalPeso:      parseFloat(totalPeso.toFixed(2)),
        totalCalorias:  parseFloat(totalCalorias.toFixed(2)),
        totalProteinas: parseFloat(totalProteinas.toFixed(2)),
        totalGrasas:    parseFloat(totalGrasas.toFixed(2))
      },
      porCada100gReceta: val100g
    };

    return res.json(resultado);

  } catch (error) {
    console.error("❌ Error al calcular valores nutricionales:", error);
    return res.status(500).json({ message: "Error interno al calcular valores nutricionales." });
  }
}


/**
 *  Función auxiliar (no usa req/res) que puede reutilizarse
 *  dentro de otros controladores. Devuelve el mismo objeto `resultado`.
 */
async function calcularNutricional(idReceta) {
  if (typeof idReceta !== "number" || isNaN(idReceta)) {
    throw new Error("ID de receta inválido.");
  }

  // Repetimos exactamente el mismo query y lógica interna, sin el req/res
  const sql = `
    SELECT
      i.id_ingrediente,
      i.nombre_ingrediente,
      ri.cantidad               AS cantidad_unidades,
      um.peso_en_gramos         AS peso_unitario,
      vn.calorias               AS cal_base,
      vn.proteinas              AS prot_base,
      vn.grasas                 AS gras_base
    FROM receta_ingrediente ri
    JOIN ingredientes i
      ON ri.id_ingrediente = i.id_ingrediente
    JOIN unidad_de_medida um
      ON ri.id_medida = um.id_medida
    JOIN valores_nutricionales vn
      ON vn.id_ingrediente = i.id_ingrediente
    WHERE ri.id_recetas = ?
  `;
  const [rows] = await db.query(sql, [idReceta]);

  if (rows.length === 0) {
    return {
      id_receta: idReceta,
      detalle_ingredientes: [],
      totales: {
        totalPeso:      0,
        totalCalorias:  0,
        totalProteinas: 0,
        totalGrasas:    0
      },
      porCada100gReceta: {
        calorias:   0,
        proteinas:  0,
        grasas:     0
      }
    };
  }

  let totalPeso       = 0;
  let totalCalorias   = 0;
  let totalProteinas  = 0;
  let totalGrasas     = 0;

  const detalleIngredientes = rows.map((fila) => {
    const unidadesUsadas   = parseFloat(fila.cantidad_unidades);
    const gramosPorUnidad  = parseFloat(fila.peso_unitario);
    const calBase          = parseFloat(fila.cal_base);
    const protBase         = parseFloat(fila.prot_base);
    const grasBase         = parseFloat(fila.gras_base);

    const pesoUsado = unidadesUsadas * gramosPorUnidad;
    const factor = pesoUsado > 0 ? pesoUsado / 100 : 0;

    const calContrib   = parseFloat((factor * calBase).toFixed(2));
    const protContrib  = parseFloat((factor * protBase).toFixed(2));
    const grasContrib  = parseFloat((factor * grasBase).toFixed(2));

    totalPeso       += pesoUsado;
    totalCalorias   += calContrib;
    totalProteinas  += protContrib;
    totalGrasas     += grasContrib;

    return {
      id_ingrediente: fila.id_ingrediente,
      nombre_ingrediente: fila.nombre_ingrediente,
      cantidad_usada: parseFloat(pesoUsado.toFixed(2)),
      base_cantidad: 100,
      macros_por_base: {
        calorias: calBase,
        proteinas: protBase,
        grasas: grasBase
      },
      contribucion: {
        calorias: calContrib,
        proteinas: protContrib,
        grasas: grasContrib
      }
    };
  });

  if (totalPeso === 0) {
    return {
      id_receta: idReceta,
      detalle_ingredientes: detalleIngredientes,
      totales: {
        totalPeso:      0,
        totalCalorias:  0,
        totalProteinas: 0,
        totalGrasas:    0
      },
      porCada100gReceta: {
        calorias:   0,
        proteinas:  0,
        grasas:     0
      }
    };
  }

  const factorNorm = 100.0 / totalPeso;
  const val100g = {
    calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
    proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
    grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
  };

  return {
    id_receta: idReceta,
    detalle_ingredientes: detalleIngredientes,
    totales: {
      totalPeso:      parseFloat(totalPeso.toFixed(2)),
      totalCalorias:  parseFloat(totalCalorias.toFixed(2)),
      totalProteinas: parseFloat(totalProteinas.toFixed(2)),
      totalGrasas:    parseFloat(totalGrasas.toFixed(2))
    },
    porCada100gReceta: val100g
  };
}

module.exports = {
  obtenerValoresNutricionales,
  calcularNutricional
};
