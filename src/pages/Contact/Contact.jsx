// client/src/pages/Contact/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Zap, Clock, Globe, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', company: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['ventas@energy-compliance.com', 'soporte@energy-compliance.com'],
      color: 'cyan'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Teléfono',
      details: ['+54 11 1234-5678', '+1 800 123-4567'],
      color: 'cyan'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Oficina Principal',
      details: ['Buenos Aires, Argentina', 'Av. Corrientes 1234, CABA'],
      color: 'cyan'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horario de Atención',
      details: ['Lunes a Viernes: 9:00 - 18:00', 'Soporte 24/7 para clientes Enterprise'],
      color: 'cyan'
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Soporte 24/7</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte. 
            Déjanos un mensaje y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-500" />
                Información de Contacto
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="bg-cyan-50 p-3 rounded-xl group-hover:bg-cyan-100 transition">
                      <div className="text-cyan-600">{info.icon}</div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 mb-1">{info.title}</p>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mapa simulado */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-center">
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-slate-300 text-sm">Av. Corrientes 1234, CABA</p>
                <p className="text-slate-400 text-xs mt-1">Buenos Aires, Argentina</p>
              </div>
              <p className="text-slate-400 text-xs">
                📍 Ver en Google Maps
              </p>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                Envíanos un mensaje
              </h2>
            </div>
            
            <div className="p-6">
              {submitted ? (
                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 text-center">
                  <div className="bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-cyan-600" />
                  </div>
                  <p className="text-cyan-800 font-semibold text-lg">¡Mensaje enviado con éxito!</p>
                  <p className="text-cyan-600 mt-2">Te responderemos a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2 text-sm">Nombre completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2 text-sm">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2 text-sm">Empresa</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="Mi Empresa S.A."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2 text-sm">Mensaje *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;