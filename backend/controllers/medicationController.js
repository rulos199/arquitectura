const pool = require('../db');
const PDFDocument = require('pdfkit');
const SendEmailCommand = require('../commands/sendEmailCommand');

exports.sendMedicationPDF = async (req, res) => {
  const { patientId } = req.body;

  // Verificar si patientId es un número válido
  if (!patientId || isNaN(patientId)) {
    return res.status(400).json({ message: 'El ID del paciente debe ser un número válido.' });
  }

  try {
    // Query para obtener los medicamentos
    const result = await pool.query(
      `SELECT m.name, m.dose, p.email 
       FROM Medication m 
       JOIN Diagnosis d ON m.medication_id = d.medication_id 
       JOIN Consultation c ON d.consultation_id = c.consultation_id 
       JOIN Patient p ON c.patient_id = p.user_id 
       WHERE c.patient_id = $1 
       ORDER BY c.consultation_id DESC LIMIT 1`,
      [Number(patientId)] // Convertir a número explícitamente
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron medicamentos para el paciente.' });
    }

    const medicamentos = result.rows;
    const email = medicamentos[0].email;

    // Crear el PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      let pdfData = Buffer.concat(buffers);

      // Crear el comando para enviar el correo electrónico
      const sendEmailCommand = new SendEmailCommand(
        email,
        'Medicamentos de su última cita',
        'Adjunto encontrará un PDF con los medicamentos de su última cita y la dirección de la droguería donde debe reclamarlos.',
        [
          {
            filename: 'medicamentos.pdf',
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
    doc.fontSize(16).text('Medicamentos de su última cita', { align: 'center' });
    doc.moveDown();
    medicamentos.forEach((medicamento) => {
      doc.fontSize(12).text(`Nombre: ${medicamento.name}`);
      doc.fontSize(12).text(`Dosis: ${medicamento.dose}`);
      doc.moveDown();
    });
    doc.fontSize(12).text('Dirección de la droguería: Calle Falsa 123');
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
  }
};