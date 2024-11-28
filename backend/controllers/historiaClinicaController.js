const pool = require('../db');
const PDFDocument = require('pdfkit');
const SendEmailCommand = require('../commands/sendEmailCommand');

exports.sendHistoriaClinicaPDF = async (req, res) => {
  const { patientId } = req.body;

  // Verificar si patientId es un número válido
  if (!patientId || isNaN(patientId)) {
    return res.status(400).json({ message: 'El ID del paciente debe ser un número válido.' });
  }

  try {
    // Query para obtener la historia clínica de los últimos 6 meses
    const result = await pool.query(
      `SELECT 
        c.consultation_id,
        c.symptoms,
        c.weight,
        c.height,
        c.age,
        c.gender,
        c.marital_status,
        c.occupation,
        c.physical_activity,
        c.cedula,
        d.suggestions,
        d.disease_probability,
        d.recommendations,
        p.email
       FROM Consultation c
       JOIN Diagnosis d ON c.consultation_id = d.consultation_id
       JOIN Patient p ON c.patient_id = p.user_id
       WHERE c.patient_id = $1 AND c.date >= NOW() - INTERVAL '6 months'
       ORDER BY c.date DESC`,
      [Number(patientId)] // Convertir a número explícitamente
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró historia clínica para el paciente.' });
    }

    const historiaClinica = result.rows;
    const email = historiaClinica[0].email;

    // Crear el PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      let pdfData = Buffer.concat(buffers);

      // Crear el comando para enviar el correo electrónico
      const sendEmailCommand = new SendEmailCommand(
        email,
        'Historia Clínica de los últimos 6 meses',
        'Adjunto encontrará un PDF con su historia clínica de los últimos 6 meses.',
        [
          {
            filename: 'historia_clinica.pdf',
            content: pdfData,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ]
      );

      try {
        await sendEmailCommand.execute();
        res.status(200).json({ message: 'PDF enviado correctamente' });
      } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
      }
    });

    // Agregar contenido al PDF
    doc.fontSize(16).text('Historia Clínica de los últimos 6 meses', { align: 'center' });
    doc.moveDown();
    historiaClinica.forEach((consulta) => {
      doc.fontSize(12).text(`Consulta ID: ${consulta.consultation_id}`);
      doc.fontSize(12).text(`Síntomas: ${consulta.symptoms}`);
      doc.fontSize(12).text(`Peso: ${consulta.weight}`);
      doc.fontSize(12).text(`Altura: ${consulta.height}`);
      doc.fontSize(12).text(`Edad: ${consulta.age}`);
      doc.fontSize(12).text(`Género: ${consulta.gender}`);
      doc.fontSize(12).text(`Estado Civil: ${consulta.marital_status}`);
      doc.fontSize(12).text(`Ocupación: ${consulta.occupation}`);
      doc.fontSize(12).text(`Actividad Física: ${consulta.physical_activity}`);
      doc.fontSize(12).text(`Cédula: ${consulta.cedula}`);
      doc.fontSize(12).text(`Sugerencias: ${consulta.suggestions}`);
      doc.fontSize(12).text(`Probabilidad de Enfermedad: ${consulta.disease_probability}%`);
      doc.fontSize(12).text(`Recomendaciones: ${consulta.recommendations}`);
      doc.moveDown();
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
  }
};