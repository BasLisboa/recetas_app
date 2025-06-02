// controllers/nutricional.controller.cjs

/**
 * Controlador independiente para calcular los valores nutricionales (calorías, proteínas y grasas) de una receta completa, dado su ID.
 */

const db = require("../config/db.cjs"); 
/**
 * 1) Función exportada para exponer vía HTTP (req, res), que devuelve los valores nutricionales completos de una receta.
 */
async function obtenerValoresNutricionales(req, res) {
  // → Validamos y parseamos idReceta desde req.params
  const idReceta = parseInt(req.params.id, 10);
  if (isNaN(idReceta)) {
    return res.status(400).json({ message: "ID de receta inválido." });
  }

  try {
    // 2) Obtenemos los ingredientes de la receta + valores nutricionales por porción
    const sql = `
      SELECT
        i.id_ingrediente,
        i.nombre_ingrediente,
        ri.cantidad       AS cantidad_usada,
        vn.cantidad       AS base_cantidad,
        vn.calorias       AS cal_base,
        vn.proteinas      AS prot_base,
        vn.grasas         AS gras_base
      FROM receta_ingrediente ri
      JOIN ingredientes i
        ON ri.id_ingrediente = i.id_ingrediente
      JOIN valores_nutricionales vn
        ON vn.id_ingrediente = i.id_ingrediente
      WHERE ri.id_receta = ?
    `;
    const [rows] = await db.query(sql, [idReceta]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron ingredientes para esa receta." });
    }

    // 3) Inicializar acumuladores
    let totalPeso       = 0;
    let totalCalorias   = 0;
    let totalProteinas  = 0;
    let totalGrasas     = 0;

    // 4) Procesar cada ingrediente
    const detalleIngredientes = rows.map((fila) => {
      const pesoUsado = parseFloat(fila.cantidad_usada); 
      const baseCant  = parseFloat(fila.base_cantidad); 
      const calBase   = parseFloat(fila.cal_base);
      const protBase  = parseFloat(fila.prot_base);
      const grasBase  = parseFloat(fila.gras_base);

      // Factor de conversión: cuántas porciones base estamos usando
      const factor = pesoUsado / baseCant;

      // Contribución nutricional de este ingrediente
      const calContrib  = parseFloat((factor * calBase).toFixed(2));
      const protContrib = parseFloat((factor * protBase).toFixed(2));
      const grasContrib = parseFloat((factor * grasBase).toFixed(2));

      // Acumular en totales
      totalPeso      += pesoUsado;
      totalCalorias  += calContrib;
      totalProteinas += protContrib;
      totalGrasas    += grasContrib;

      return {
        id_ingrediente: fila.id_ingrediente,
        nombre_ingrediente: fila.nombre_ingrediente,
        cantidad_usada: pesoUsado,
        base_cantidad: baseCant,
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

    // 5) Evitar división por cero
    if (totalPeso === 0) {
      return res.status(400).json({ message: "El peso total de la receta es cero." });
    }

    // 6) Calcular valores normalizados por cada 100 g de receta
    const factorNorm = 100.0 / totalPeso;
    const val100g = {
      calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
      proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
      grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
    };

    // 7) Construir y devolver JSON
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
 * 2) Función auxiliar (reutilizable dentro de otros controladores) que
 *    NO usa (req, res), sino sólo el ID de receta. 
 *    Devuelve una promesa con el mismo objeto `resultado` que arriba.
 *
 *    Ya no redeclaramos `const idReceta = parseInt(req.params.id, ...)`,
 *    sino que usamos directamente el parámetro `idReceta`.
 */
async function calcularNutricional(idReceta) {  // ← CORRECCIÓN: recibimos idReceta directamente
  // 2.1) Validación básica del parámetro
  if (typeof idReceta !== "number" || isNaN(idReceta)) {
    throw new Error("ID de receta inválido.");
  }

  // 2.2) Mismo SQL para obtener ingredientes + valores base
  const sql = `
    SELECT
      i.id_ingrediente,
      i.nombre_ingrediente,
      ri.cantidad       AS cantidad_usada,
      vn.cantidad       AS base_cantidad,
      vn.calorias       AS cal_base,
      vn.proteinas      AS prot_base,
      vn.grasas         AS gras_base
    FROM receta_ingrediente ri
    JOIN ingredientes i
      ON ri.id_ingrediente = i.id_ingrediente
    JOIN valores_nutricionales vn
      ON vn.id_ingrediente = i.id_ingrediente
    WHERE ri.id_receta = ?
  `;
  const [rows] = await db.query(sql, [idReceta]);

  if (rows.length === 0) {
    // Si no hay ingredientes, devolvemos un objeto con arrays vacíos o lanzamos error.
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

  // 2.3) Inicializar acumuladores
  let totalPeso       = 0;
  let totalCalorias   = 0;
  let totalProteinas  = 0;
  let totalGrasas     = 0;

  // 2.4) Recorrer filas y acumular
  const detalleIngredientes = rows.map((fila) => {
    const pesoUsado = parseFloat(fila.cantidad_usada);
    const baseCant  = parseFloat(fila.base_cantidad);
    const calBase   = parseFloat(fila.cal_base);
    const protBase  = parseFloat(fila.prot_base);
    const grasBase  = parseFloat(fila.gras_base);

    const factor = pesoUsado / baseCant;

    const calContrib  = parseFloat((factor * calBase).toFixed(2));
    const protContrib = parseFloat((factor * protBase).toFixed(2));
    const grasContrib = parseFloat((factor * grasBase).toFixed(2));

    totalPeso      += pesoUsado;
    totalCalorias  += calContrib;
    totalProteinas += protContrib;
    totalGrasas    += grasContrib;

    return {
      id_ingrediente: fila.id_ingrediente,
      nombre_ingrediente: fila.nombre_ingrediente,
      cantidad_usada: pesoUsado,
      base_cantidad: baseCant,
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

  // 2.5) Evitar división por cero
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

  // 2.6) Cálculo de normalización
  const factorNorm = 100.0 / totalPeso;
  const val100g = {
    calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
    proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
    grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
  };

  // 2.7) Devolver el mismo formato que en obtenerValoresNutricionales
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
  calcularNutricional  // Puedes exportarla si la necesitas en otros controladores
};
