// controllers/nutricional.controller.cjs

/**
 * Controlador independiente para calcular
 * los valores nutricionales (calorías, proteínas y grasas)
 * de una receta completa, dado su ID.
 * 
 * La lógica es:
 *  - Por cada ingrediente de la receta:
 *      * Buscamos “cantidad_usada” (en g) en receta_ingrediente.
 *      * Buscamos en valores_nutricionales la porción base (p. ej. 100 g)
 *        y las calorías, proteínas y grasas que esa porción aporta.
 *      * Calculamos el factor = (cantidad_usada / cantidad_val_nutricional).
 *      * Contribución de macros = factor * macros_por_porcion.
 *      * Acumulamos a totales.
 *  - Devolvemos:
 *      • Lista de ingredientes con su contribución nutricional individual.
 *      • Objetos “totales” con sumas y, si quisieras, normalización por 100g.
 */

const db = require("../config/db.cjs"); 
// Asegúrate de que este “db” sea un pool de MySQL (mysql2/promise, por ejemplo) que permita:
//    const [rows] = await db.query(sql, params);

async function obtenerValoresNutricionales(req, res) {
  // 1) Leer y validar parámetro ID de receta
  const idReceta = parseInt(req.params.id, 10);
  if (isNaN(idReceta)) {
    return res.status(400).json({ message: "ID de receta inválido." });
  }

  try {
    // 2) Traer ingredientes + cantidad_usada + valores nutricionales base
    //    JOIN entre:
    //      - receta_ingrediente AS ri
    //      - ingredientes       AS i
    //      - valores_nutricionales AS vn
    //
    //   Seleccionamos:
    //     • ri.cantidad      → gramos usados en la receta
    //     • vn.cantidad      → porción base de la que provienen calorías, proteínas, grasas (p.ej. 100 g)
    //     • vn.calorias      → calorías para “vn.cantidad” gramos
    //     • vn.proteinas     → proteínas para “vn.cantidad” gramos
    //     • vn.grasas        → grasas para “vn.cantidad” gramos
    //     • i.nombre_ingrediente
    //
    const sql = `
      SELECT
        i.id_ingrediente,
        i.nombre_ingrediente,
        ri.cantidad       AS cantidad_usada,    -- ejemplo: 150 (g) que usa la receta
        vn.cantidad       AS base_cantidad,     -- p.ej. 100 (g)
        vn.calorias       AS cal_base,          -- calorías para “base_cantidad” gramos
        vn.proteinas      AS prot_base,         -- proteínas para “base_cantidad” gramos
        vn.grasas         AS gras_base          -- grasas para “base_cantidad” gramos
      FROM receta_ingrediente ri
      JOIN ingredientes i
        ON ri.id_ingrediente = i.id_ingrediente
      JOIN valores_nutricionales vn
        ON vn.id_ingrediente = i.id_ingrediente
      WHERE ri.id_receta = ?
    `;
    const [rows] = await db.query(sql, [idReceta]);

    if (rows.length === 0) {
      // Si no hay ingredientes registrados para esa receta:
      return res.status(404).json({ message: "No se encontraron ingredientes para esa receta." });
    }

    // 3) Inicializar acumuladores
    let totalPeso       = 0;    // suma de todas las parejas “cantidad_usada”
    let totalCalorias   = 0;
    let totalProteinas  = 0;
    let totalGrasas     = 0;

    // 4) Procesar cada fila para calcular contribuciones
    //    rows es un array de objetos con:
    //      {
    //        id_ingrediente,
    //        nombre_ingrediente,
    //        cantidad_usada,  // gramos
    //        base_cantidad,   // p.ej. 100 gramos
    //        cal_base,        // calorías para base_cantidad
    //        prot_base,       // proteínas para base_cantidad
    //        gras_base        // grasas para base_cantidad
    //      }
    //
    const detalleIngredientes = rows.map((fila) => {
      const pesoUsado = parseFloat(fila.cantidad_usada); 
      const baseCant  = parseFloat(fila.base_cantidad); 
      const calBase   = parseFloat(fila.cal_base);
      const protBase  = parseFloat(fila.prot_base);
      const grasBase  = parseFloat(fila.gras_base);

      // Calcular cuántas “porciones base” estamos usando
      // ej. si base_cantidad = 100, y pesoUsado = 150 → factor = 1.5
      const factor = pesoUsado / baseCant;

      // Contribución de cada macro
      const calContrib  = parseFloat((factor * calBase).toFixed(2));
      const protContrib = parseFloat((factor * protBase).toFixed(2));
      const grasContrib = parseFloat((factor * grasBase).toFixed(2));

      // Acumular a totales
      totalPeso      += pesoUsado;
      totalCalorias  += calContrib;
      totalProteinas += protContrib;
      totalGrasas    += grasContrib;

      return {
        id_ingrediente: fila.id_ingrediente,
        nombre_ingrediente: fila.nombre_ingrediente,
        cantidad_usada: pesoUsado,         // en gramos
        base_cantidad: baseCant,           // porción de referencia (p.ej. 100 g)
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

    // 6) Calcular valores normalizados “por cada 100 g de receta”
    const factorNorm = 100.0 / totalPeso;
    const val100g = {
      calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
      proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
      grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
    };

    // 7) Armar el JSON de respuesta (solo la parte nutricional)
    const resultado = {
      id_receta: idReceta,
      detalle_ingredientes: detalleIngredientes,
      totales: {
        totalPeso:      parseFloat(totalPeso.toFixed(2)),   // en g
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

//####################################################
async function calcularNutricional(idReceta) {
  // 1) Leer y validar parámetro ID de receta
  const idReceta = parseInt(req.params.id, 10);
  if (isNaN(idReceta)) {
    return res.status(400).json({ message: "ID de receta inválido." });
  }

  try {
    
    //Es igual que la otra funcion.

    const sql = `
      SELECT
        i.id_ingrediente,
        i.nombre_ingrediente,
        ri.cantidad       AS cantidad_usada,    -- ejemplo: 150 (g) que usa la receta
        vn.cantidad       AS base_cantidad,     -- p.ej. 100 (g)
        vn.calorias       AS cal_base,          -- calorías para “base_cantidad” gramos
        vn.proteinas      AS prot_base,         -- proteínas para “base_cantidad” gramos
        vn.grasas         AS gras_base          -- grasas para “base_cantidad” gramos
      FROM receta_ingrediente ri
      JOIN ingredientes i
        ON ri.id_ingrediente = i.id_ingrediente
      JOIN valores_nutricionales vn
        ON vn.id_ingrediente = i.id_ingrediente
      WHERE ri.id_receta = ?
    `;
    const [rows] = await db.query(sql, [idReceta]);

    if (rows.length === 0) {
      // Si no hay ingredientes registrados para esa receta:
      return res.status(404).json({ message: "No se encontraron ingredientes para esa receta." });
    }

    // 3) Inicializar acumuladores
    let totalPeso       = 0;    // suma de todas las parejas “cantidad_usada”
    let totalCalorias   = 0;
    let totalProteinas  = 0;
    let totalGrasas     = 0;

    // 4) Procesar cada fila para calcular contribuciones
    
    const detalleIngredientes = rows.map((fila) => {
      const pesoUsado = parseFloat(fila.cantidad_usada); 
      const baseCant  = parseFloat(fila.base_cantidad); 
      const calBase   = parseFloat(fila.cal_base);
      const protBase  = parseFloat(fila.prot_base);
      const grasBase  = parseFloat(fila.gras_base);

      // Calcular cuántas “porciones base” estamos usando
      // ej. si base_cantidad = 100, y pesoUsado = 150 → factor = 1.5
      const factor = pesoUsado / baseCant;

      // Contribución de cada macro
      const calContrib  = parseFloat((factor * calBase).toFixed(2));
      const protContrib = parseFloat((factor * protBase).toFixed(2));
      const grasContrib = parseFloat((factor * grasBase).toFixed(2));

      // Acumular a totales
      totalPeso      += pesoUsado;
      totalCalorias  += calContrib;
      totalProteinas += protContrib;
      totalGrasas    += grasContrib;

      return {
        id_ingrediente: fila.id_ingrediente,
        nombre_ingrediente: fila.nombre_ingrediente,
        cantidad_usada: pesoUsado,         // en gramos
        base_cantidad: baseCant,           // porción de referencia (p.ej. 100 g)
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

    // 6) Calcular valores normalizados “por cada 100 g de receta”
    const factorNorm = 100.0 / totalPeso;
    const val100g = {
      calorias:   parseFloat((totalCalorias  * factorNorm).toFixed(2)),
      proteinas:  parseFloat((totalProteinas * factorNorm).toFixed(2)),
      grasas:     parseFloat((totalGrasas    * factorNorm).toFixed(2))
    };

    // 7) Armar el JSON de respuesta (solo la parte nutricional)
    const resultado = {
      id_receta: idReceta,
      detalle_ingredientes: detalleIngredientes,
      totales: {
        totalPeso:      parseFloat(totalPeso.toFixed(2)),   // en g
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

module.exports = {
  obtenerValoresNutricionales,

};
