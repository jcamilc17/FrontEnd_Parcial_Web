"use client";

import { ChangeEvent } from "react";
import { inputClass, labelClass } from "./FormularioActor";

// Datos que componen un premio (coinciden con el PrizeDto del back)
export type DatosPremio = {
  name: string;
  category: string;
  year: string; // se guarda como texto en el input y se convierte a número al enviarlo
  status: string; // 'won' o 'nominated'
};

// Valores iniciales de un premio vacío
export const premioVacio: DatosPremio = {
  name: "",
  category: "",
  year: "",
  status: "won",
};

type Props = {
  premio: DatosPremio;
  setPremio: (premio: DatosPremio) => void;
};

// PARTE 9: Subcomponente con los campos del premio, se usa dentro de FormularioPelicula
function FormularioPremio({ premio, setPremio }: Props) {
  // Actualiza únicamente el campo modificado conservando el resto de valores del premio
  const actualizar = (campo: keyof DatosPremio, valor: string) => setPremio({ ...premio, [campo]: valor });

  return (
    // Cuadrícula con los campos del premio: nombre, categoría, año y estado
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Nombre del premio (ej: Premio Óscar) */}
      <div className="md:col-span-2">
        <label htmlFor="prize-name" className={labelClass}>Nombre</label>
        <input
          id="prize-name"
          type="text"
          value={premio.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => actualizar("name", e.target.value)}
          placeholder="Premio Óscar"
          className={inputClass}
          required
        />
      </div>

      {/* Categoría del premio (ej: Mejor película) */}
      <div className="md:col-span-2">
        <label htmlFor="prize-category" className={labelClass}>Categoría</label>
        <input
          id="prize-category"
          type="text"
          value={premio.category}
          onChange={(e: ChangeEvent<HTMLInputElement>) => actualizar("category", e.target.value)}
          placeholder="Mejor película"
          className={inputClass}
          required
        />
      </div>

      {/* Año en que se otorgó el premio */}
      <div>
        <label htmlFor="prize-year" className={labelClass}>Año</label>
        <input
          id="prize-year"
          type="number"
          min={1800}
          value={premio.year}
          onChange={(e: ChangeEvent<HTMLInputElement>) => actualizar("year", e.target.value)}
          className={inputClass}
          required
        />
      </div>

      {/* Estado del premio: el back solo acepta 'won' o 'nominated' */}
      <div>
        <label htmlFor="prize-status" className={labelClass}>Estado</label>
        <select
          id="prize-status"
          value={premio.status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => actualizar("status", e.target.value)}
          className={inputClass}
          required
        >
          <option value="won">Ganado</option>
          <option value="nominated">Nominado</option>
        </select>
      </div>
    </div>
  );
}

export default FormularioPremio;
