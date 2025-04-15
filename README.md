# annual-project-musicalendar
Annual project for the Professional Practice 2 class of the Systems' Analyst curriculum

# Musicalendaria

# VISIÓN GENERAL
Sistema  de  cartelera  y  promoción  online  de  plataformas  musicales  y  calendario  de 
presentaciones en vivo. Otros nombres posibles: Mar del Calendar. Hoy se sale, etc. 
Ejemplos: 
https://www.alternativateatral.com/cartelera.asp  
https://espaciocuatroelementos.com/section/346

# Requerimientos 
#   No funcionales:  
1.  Tecnologías y lenguajes permitidos: nodejs, apache, mysql, mongodb. HTML, CSS y JS, 
PHP (opcional). 
2.  El sistema no debe consumir recursos del servidor a causa del guardado de archivos de 
videos o imágenes. 
3.  Solo permite la carga de enlaces. 
#   Funcionales: 
    El sistema debe gestionar dos roles de usuario: administrador y artista. 
1.  Funciones del administrador: 
a.  Validar que el artista no sea Eminem. Tampoco Dua Lipa, Catriel o Paco Amoroso. 
2.  Funciones del artista:  
a.  ABML de Información personal: Foto de artista (enlace a google drive), contacto: 
correo electrónico, teléfono, 
b.  ABML de sitio web o portfolio online del artista. 
c.  ABML de Plataformas de Streaming y otros: Spotify, Apple Music, Tidal, Youtube 
Music, etc. 
d.  ABML de canal de youtube. 
e.  ABML de Instagram.  
f.  Función de Calendario: 
i.  Fecha y hora. 
ii.  Lugar de la presentación. 
iii.  Modalidad de entrada: gorra, gratuito, beneficio, arancelado. 
iv.  Precio (opcional). 
v.  Enlace a plataforma de venta de entradas online (opcional). 
vi.  Enlace a google drive del flyer. 
    El sistema gestionará una cartelera que se conformará automáticamente con la 
información que carguen los artistas en el calendario de presentaciones en vivo.