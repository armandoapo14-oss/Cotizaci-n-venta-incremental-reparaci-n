/* global TrelloPowerUp */

// Inicializar el Power-Up
TrelloPowerUp.initialize({
  // Agregar botón en cada tarjeta
  'card-buttons': function(t, options) {
    return [{
      // Icono y texto del botón
      icon: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png',
      text: '📋 Inspección y Cotización',
      // Función que se ejecuta al hacer clic
      callback: function(t) {
        return t.popup({
          title: 'Inspección de Vehículo',
          url: './trello-powerup-embedded.html',
          height: 600
        });
      }
    }];
  },

  // Agregar badge con contador de problemas
  'card-badges': function(t, options) {
    return t.get('card', 'shared', 'inspeccionData')
      .then(function(data) {
        if (!data || !data.checklist) {
          return [];
        }

        // Contar items MAL
        let problemCount = 0;
        Object.keys(data.checklist).forEach(categoria => {
          data.checklist[categoria].forEach(item => {
            if (item.estado === 'mal') {
              problemCount++;
            }
          });
        });

        if (problemCount === 0) {
          return [{
            text: '✅ OK',
            color: 'green'
          }];
        }

        // Determinar color según cantidad de problemas
        let color = 'yellow';
        if (problemCount > 3 && problemCount <= 7) {
          color = 'orange';
        } else if (problemCount > 7) {
          color = 'red';
        }

        return [{
          text: `⚠️ ${problemCount} problema${problemCount > 1 ? 's' : ''}`,
          color: color
        }];
      })
      .catch(function(error) {
        console.error('Error al cargar badge:', error);
        return [];
      });
  },

  // Agregar sección en la parte trasera de la tarjeta
  'card-back-section': function(t, options) {
    return t.get('card', 'shared', 'inspeccionData')
      .then(function(data) {
        if (!data) {
          return {
            title: 'Inspección y Cotización',
            icon: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png',
            content: {
              type: 'iframe',
              url: t.signUrl('./card-back-section.html'),
              height: 230
            }
          };
        }

        // Mostrar resumen
        let totalProblemas = 0;
        if (data.checklist) {
          Object.keys(data.checklist).forEach(categoria => {
            data.checklist[categoria].forEach(item => {
              if (item.estado === 'mal') {
                totalProblemas++;
              }
            });
          });
        }

        return {
          title: 'Inspección y Cotización',
          icon: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png',
          content: {
            type: 'iframe',
            url: t.signUrl('./card-back-section.html'),
            height: 230
          }
        };
      });
  },

  // Capacidades del Power-Up
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Configuración',
      url: './settings.html',
      height: 184
    });
  },

  // Autorización (si se necesita)
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'token')
      .then(function(token) {
        return { authorized: token != null };
      });
  },

  'show-authorization': function(t, options) {
    return t.popup({
      title: 'Autorización',
      url: './authorize.html',
      height: 140
    });
  }
});

console.log('Power-Up de Inspección y Cotización inicializado');
