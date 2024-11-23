import { useState } from 'react';

const AutorizarMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState('');

  const agregarMedicamento = () => {
    if (nuevoMedicamento) {
      setMedicamentos([...medicamentos, nuevoMedicamento]);
      setNuevoMedicamento('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(medicamentos);
    // Enviar lista de medicamentos al backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nuevoMedicamento}
        placeholder="Nombre del medicamento"
        onChange={(e) => setNuevoMedicamento(e.target.value)}
      />
      <button type="button" onClick={agregarMedicamento}>Agregar Medicamento</button>
      <ul>
        {medicamentos.map((med, index) => (
          <li key={index}>{med}</li>
        ))}
      </ul>
      <button type="submit">Guardar Medicamentos</button>
    </form>
  );
};

export default AutorizarMedicamentos;
