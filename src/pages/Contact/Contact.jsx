import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ¿Tienes preguntas? Estamos aquí para ayudarte. 
          Déjanos un mensaje y te responderemos a la brevedad.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Información de contacto */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">ventas@energy-compliance.com</p>
                <p className="text-gray-600">soporte@energy-compliance.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Teléfono</p>
                <p className="text-gray-600">+54 11 1234-5678</p>
                <p className="text-gray-600">+1 800 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Oficina Principal</p>
                <p className="text-gray-600">Buenos Aires, Argentina</p>
                <p className="text-gray-600">Av. Corrientes 1234, CABA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-green-800 font-semibold">¡Mensaje enviado con éxito!</p>
              <p className="text-green-600 mt-2">Te responderemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Mensaje *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;