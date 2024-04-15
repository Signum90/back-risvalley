const UsersModel = require('../models/Users');
const EntidadesModel = require('../models/Entidades');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const EventosModel = require('../models/Eventos');
const PqrsModel = require('../models/Pqrs');
const CursosModel = require('../models/Cursos');
const { generatePasswordTemporal, generateKeyWord } = require('../helpers/helpers');
const { sequelize } = require('../db/connection');
const bcrypt = require('bcrypt');
const KeyWordsModel = require('../models/KeyWords');

class GeneralsCTR {
  async getStadisticsSoftware(req, res) {
    try {
      const countUsers = await UsersModel.count();
      const countEntidades = await EntidadesModel.count();
      const countRetos = await RetosTecnologicosModel.count();
      const countServices = await ServiciosTecnologicosModel.count();
      const countEventos = await EventosModel.count();
      const countPQRs = await PqrsModel.count();
      const countCourses = await CursosModel.count();

      const data = {
        'totalUsers': countUsers,
        'totalEntidades': countEntidades,
        'totalRetos': countRetos,
        'totalServicios': countServices,
        'totalEventos': countEventos,
        'totalPQRs': countPQRs,
        'totalCursos': countCourses
      }

      return res.status(200).json({ msg: 'success', data });

    } catch (error) {
      console.log("🚀 ~ GeneralsCTR ~ getStadisticsSoftware ~ error:", error)
      throw error;
    }
  }

  async postMasiveEntity(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const data = [
          {
            "nombre": "(A.C.D.M) ANÁLISIS CRÍTICO DEL DISCURSO MULTIMODAL: ESTUDIOS Y APLICACIONES TRANSVERSALES EN ÁMBITOS SOCIO-ACADÉMICOS",
            "descripcion": "Consolidar procesos investigativos y académicos en torno al análisis crítico del discurso en el programa de literatura y lengua castellana ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "lagh@utp.edu.co"
          },
          {
            "nombre": "700 Repart COL0029254",
            "descripcion": "Objetivo General: Generar espacios de producción teórica y conceptual sobre la Estética y el Arte en el contexto de nuestra región.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "artescd@gmail.com"
          },
          {
            "nombre": "ABE- Aplicación de las ecuaciones diferenciales, bifurcación y estabilidad. COL0130509",
            "descripcion": "Desarrollar investigación dirigida a resolver problemas de aplicación de las ecuaciones diferenciales ordinarias y parciales lineales y no lineales que surjan de la modelación matemática y del estudio analítico de los métodos propios del análisis real, complejo y funcional. Además, generar nuevo conocimiento en la enseñanza de la variable compleja, que permita mejorar la asimilación de todas las herramientas y conceptos.1.- Bifurcación y Estabilidad 2.- Ecuaciones diferenciales ordinarias y parciales 3.- Educación matemática",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "jorodryy@utp.edu.co"
          },
          {
            "nombre": "ACOPI Regional Centro Occidente",
            "descripcion": "ACOPI Regional Centro Occidente, presente en Risaralda, Quindío, Chocó y Norte del Valle, promueve gestión empresarial, innovación social, agencia de empleo y observatorio tecnológico.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Cra. 12b # 8 - 48",
            "telefono": "3207881462 - 3008762030",
            "dominio": "https:acopicentrooccidente.org ",
            "email": "direccionejecutiva@acopicentrooccidente.org"
          },
          {
            "nombre": "Administración en las industrias y organizaciones AIO COL0144238",
            "descripcion": "Generar conocimientos desde las cuatro funciones administrativas que permitan a las organizaciones una adecuada gestión. Propiciar el espíritu emprendedor y la generación de iniciativas empresariales. 1.- Organización y convergencia tecnológica 2.- Organización y sociedad",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-102",
            "email": "anam.barrerar@unilibre.edu.co"
          },
          // {
          //   "nombre": "ADMPYME COL0177041",
          //   "descripcion": "Desarrollar proyectos de investigación en el sector financiero, administrativo, mercadeo y sistemas de información bajo las líneas adscritas, para la estructuración de propuestas de valor aplicadas a necesidades de contexto regional con rigor científico. 1.- Competitividad en la Micro, pequeña y mediana empresa en Risaralda 2.- Finanzas para las Micro, pequeña y mediana empresa en Risaralda 3.- Gestión del Mercadeo, entorno y nuevas tecnologías 4.- Innovación Educativa 5.- Modelos Gerenciales Regionales",
          //   "tipo": "Asesoría y consultoría",
          //   "tipoCliente": "Sociedad",
          //   "direccion": "FUNDACION UNIVERSITARIA COMFAMILIAR RISARALDA, Vereda el Jazmín kilómetro 4. Vía Santa Rosa de Cabal – Chinchiná",
          //   "email": "investigacion@uc.edu.co"
          // },
          {
            "nombre": "Agrosavia Sede Eje Cafetero",
            "descripcion": "Centra sus esfuerzos en superar limitaciones tecnológicas en redes de cacao, frutales, cultivos permanentes, ganadería, especies menores y agroindustrias al sector agropecuario del eje cafetero.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Av. Alberto Mendoza, Cra 23 No. 74-71. Piso 7, Edificio ANDI",
            "telefono": "(+57) 60 1 4227300",
            "dominio": "https:www.agrosavia.co nosotros sedes sede-eje-cafetero",
            "email": "jmrojas@agrosavia.co"
          },
          {
            "nombre": "Agua y Saneamiento COL0020339",
            "descripcion": "Generar soluciones técnicas y administrativas basadas en la investigación y desarrollo para la gestión de recursos hídricos y residuos sólidos. 1.- Calidad y fuentes de contaminación de recursos hídricos 2.- Desarrollo de instrumentos y herramientas para la gestión de recursos hídricos y su adaptación al cambio climático 3.- Desarrollo, adaptación y aplicación de tecnologías apropiadas 4.- Fitorremediación de aguas residuales domésticas e industriales 5.- Gestión de la calidad y cantidad del agua 6.- Gestión integral de residuos sólidos. ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "aguaysaneamiento@utp.edu.co"
          },
          {
            "nombre": "Aguas y Aguas de Pereira",
            "descripcion": "Empresa de servicios públicos que gestiona el recurso hídrico en Pereira",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "Cra. 10 #17-55 piso 4, Energia de Pereira",
            "telefono": "(606) 3151300",
            "dominio": "https:www.aguasyaguas.com.co ",
            "email": "chincapie@aguasyaguas.com.co"
          },
          {
            "nombre": "Alcaldía de Pereira",
            "descripcion": "Servicios para el crecimiento económico y la sostenibilidad ambiental del territorio; administrando los recursos públicos de para la implementación de las políticas, planes, programas y proyectos.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Sociedad",
            "direccion": "Cra. 7 No. 18-55",
            "telefono": "(57) 6 3248000 - 6 3248179",
            "dominio": "https:www.pereira.gov.co ",
            "email": "competitividad@pereira.gov.co"
          },
          {
            "nombre": "Alcaldía de Santa Rosa de Cabal",
            "descripcion": "Servicios para el crecimiento económico y la sostenibilidad ambiental del territorio; administrando los recursos públicos de para la implementación de las políticas, planes, programas y proyectos.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 14 con Calle 12 Esquina",
            "telefono": "57 606 3660600 ext. 101",
            "dominio": "https:www.santarosadecabal-risaralda.gov.co ",
            "email": "culturayturismo@santarosadecabal-risaralda.gov.co"
          },
          {
            "nombre": "Alcaldía Dosquebradas",
            "descripcion": "Servicios para el crecimiento económico y la sostenibilidad ambiental del territorio; administrando los recursos públicos de para la implementación de las políticas, planes, programas y proyectos.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 16 # 36 - 44 Avenida Simón Bolivar # 36 - 44",
            "telefono": 63116566,
            "dominio": "https:www.dosquebradas.gov.co web ",
            "email": "dirempresarial@dosquebradas.gov.co"
          },
          {
            "nombre": "Alimentos del Valle S.A.",
            "descripcion": "Productora y distribuidora de alimentos con mas de medio siglo en la industria, creada para satisfacer las expectativas y necesidades de sus clientes mediante el procesamiento y comercialización de leches ultrapasteurizadas, derivados lácteos, agua mineral, refrescos y la distribución de importantes marcas como Super de Alimentos, Inavigor y Red Bull.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 8 Bis #37b-21, Centro",
            "telefono": "(606) 336-6877",
            "dominio": "https:www.alival.com.co cobertura caldas ",
            "email": "pereira@alival.com.co"
          },
          {
            "nombre": "Análisis Envolvente de Datos   Data Envelopment Analysis COL0020348",
            "descripcion": "Estudiar, analizar, comparar y evaluar los aportes de diferentes metodologías ya existentes en la medición de la eficiencia de los sistemas económico-administrativos. Evaluar ventajas desventajas y discrepancias entre las diferentes metodologías. 1.- Análisis de Medidas de Eficiencia y Productividad 2.- Dinámica de Sistemas 3.- Línea en Transporte: planeación, gestión, control y optimización 4.- Sistemas de Producción y Operaciones 5.- Sociología Computacional, análisis de redes sociales, simulación basada en agentes, simulación basada en dinámica de sistemas ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "mbernal@utp.edu.co"
          },
          {
            "nombre": "ANDI Seccional Risaralda-Quindío",
            "descripcion": "Lidera a nivel regional procesos e iniciativas que impulsan el crecimiento económico y mejoran la calidad de vida.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Avenida Circunvalar 13-40 oficina 312A,Uniplex",
            "telefono": 6063515300,
            "dominio": "https:www.andi.com.co Home Seccional 9-risaralda---quindio",
            "email": "Lhiginio@andi.com.co"
          },
          {
            "nombre": "Applied NeuroScience COL0133341",
            "descripcion": "Desarrollar investigaciones que contribuyan al mejoramiento de la calidad de vida de las personas afectadas por patologías neurológicas. 1.- Neurocirugía 2.- Neurología 3.- Neuropsicología 4.- Procesamiento de bioseñales e imágenes médicas 5.- Rehabilitación ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "INSTITUTO DE EPILEPSIA Y PARKINSON DEL EJE CAFETERO SA Cl. 12 #18-24 Torre 3 Piso 3, Megacentro,",
            "email": "research@neurocentro.co"
          },
          {
            "nombre": "Área Metropolitana Centro Occidente (AMCO)",
            "descripcion": "Servicios de intervención en ciudad y entorno, abastecimiento y vertimiento de agua, producción y manejo de residuos sólidos, movilidad y transporte público, hábitat y vivienda, riesgo y cambio climático, mercado de suelo, territorio y sociedad, transformación productiva y competitividad, seguridad humana, desarrollo económico local y comunicación e intercambio de información",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 25 # 7-48, Unidad Administrativa El Lago",
            "telefono": "(606) 335 65 35 - (606) 335 72 18",
            "dominio": "https:www.amco.gov.co ",
            "email": "deconomico@amco.gov.co"
          },
          {
            "nombre": "ARL SURA",
            "descripcion": "Empresa de Administradora de Riesgos Laborales. Sus servicios se orientan a prevenir, atender y proteger a los trabajadores de los efectos causados por accidentes y enfermedades laborales.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Calle 15 No 13 -110",
            "telefono": "(6) 313 8444",
            "dominio": "https:arlsura.com index.php 53-oficinas- regional-antioquia-y-eje-cafetero- 1221-oficina-pereira",
            "email": "jcardenas@sura.com.co"
          },
          {
            "nombre": "Arquitectura y Diseño UCP COL0053231",
            "descripcion": "Profundizar en el estudio de las temáticas que abordan la Arquitectura y el Diseño en relación con el proyecto, la cultura, el territorio, la técnica y la tecnología, enmarcadas en un contexto sociocultural de Región (Eje Cafetero), al generar propuestas que contribuyan al desarrollo local y nacional. 1.- Diseño, empresa y comunidad 2.- Enseñanza del proyecto en la arquitectura y el diseño 3.- Hábitat, territorio y cultura 4.- Técnica, tecnología y sustentabilidad",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UCP Las Americas, Avenida Sur, Cra 21 #49-95",
            "email": "juan5.lopez@ucp.edu.co"
          },
          {
            "nombre": "Arte y Cultura COL0028219",
            "descripcion": "1. Construir conocimiento relevante, social y académicamente, en los campos que conciernen al arte, la estética y a la cultura en general. 2. Fortalecer de manera activa las líneas de investigación en Arte contemporáneo. 1.- Arte Contemporáneo 2.- Enseñabilidad de las Ciencias Humanas 3.- Estudios Culturales y Narrativas Contemporáneas 4.- Estética, comunicación y transmedia 5.- Socialización Política y Cultura Política",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "aumar@utp.edu.co"
          },
          {
            "nombre": "ArtNovus COL0193107",
            "descripcion": "Generar escenarios en los cuales los docentes, estudiantes y demás comunidad académica del programa de Licenciatura en Música, puedan desarrollar procesos investigativos atendiendo las características del perfil profesional.1.- Innovación 2.- Línea de producción 3.- Línea Pedagogía y Didáctica de la música 4.- Música, Tecnología, emprendimiento e Innovación",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "kathy@utp.edu.co"
          },
          {
            "nombre": "Asociación Ambiental Paramatma",
            "descripcion": "Programas para la defensa de animales y del medio ambiente, construyendo mentes consientes y trabajando para disminuir el sufrimiento de cientos de animales, que son abandonados y utilizados inhumanamente",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "CARRERA 25 20 15 LA HERMOSA EL CAMPESTRE",
            "telefono": 3127156481,
            "dominio": "https:m.facebook.com profile.php?id=603093213456169",
            "email": "alejitafranco22@hotmail.com"
          },
          {
            "nombre": "Asociación Colombiana de Agencias de Viajes y Turismo (ANATO)",
            "descripcion": "ANATO lidera la transformación y fortalecimiento del turismo en Colombia, representando a sus Asociados ante el Estado, promoviendo competitividad y sostenibilidad.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "CARRERA 19B NO. 83-63EDIFICIO ANATO PISO 8",
            "telefono": "(+57) 601 4322040",
            "dominio": "https:anato.org directorio ",
            "email": "direccionejecafetero@anato.org"
          },
          {
            "nombre": "Asociación Comunitaria Yarumo Blanco",
            "descripcion": "Promover el bienestar ambiental, socio-cultural y económico de la cuenca del río Otún a través de las actividades sostenibles en educación y servicios de turismo en naturaleza",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Corporaciones ambientales",
            "direccion": "Via La Suiza-VEREDA LA SUIZA - FINCA BUENOS AIRES",
            "telefono": "310 3635001",
            "dominio": "https:yarumoblanco.co ",
            "email": "reservasyarumo@gmail.com "
          },
          {
            "nombre": "Asociación De Amigos De La Fauna- Asociada",
            "descripcion": "Programas de protección para ecosistemas de la región, promoviendo el cuidado de la fauna en el territorio",
            "tipo": "Otros",
            "tipoCliente": "Corporaciones ambientales",
            "direccion": "CARRERA CORREGIMIENTO DE SANTA CECILIA BARRIO CINTO SEDE DE LA",
            "telefono": 3164175505,
            "email": "anyeli_tp@hotmail.com"
          },
          {
            "nombre": "Asociación de municipios de Risaralda",
            "descripcion": "Prestación de servicios públicos, la ejecución de obras de ámbito regional y el cumplimiento de funciones administrativas propias",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 19 Nº 8-34 Piso 5 Oficina 15",
            "telefono": 3147992294,
            "dominio": "http:www.asomur.gov.co ",
            "email": "amcer01@gmail.com"
          },
          {
            "nombre": "Audifarma SA",
            "descripcion": "Empresa dedicada a la comercialización de productos farmacéuticos para la salud",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 105 Nro. 14 140 Barrio Belmonte",
            "telefono": "57-60-6-313-7800",
            "dominio": "https:audifarma.com.co ",
            "email": "gi_mesa@audifarma.com.co"
          },
          {
            "nombre": "Automática COL0002859",
            "descripcion": "Diseño y desarrollo de metodologías aplicadas al análisis de imágenes, de señales y en general de datos. Diseño y desarrollo de sistemas basados en visión por computador. Diseño y desarrollo de métodos para identificar modelos óptimos de procesos físicos. Diseño de sistemas automáticos y autónomos. 1.- Análisis de datos2.- Aprendizaje de Máquina3.- Bioingeniería4.- Biología Computacional5.- Control y optimización6.- Desarrollo de sistemas automáticos y autónomos.7.- Electrónica de Potencia8.- Instrumentación y medidas9.- Modelamiento de fenómenos físicos.10.- Procesamiento de lenguaje natural11.- Sociología computacional.12.- Tratamiento digital de señales13.- Visión por computador.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "aaog@utp.edu.co"
          },
          {
            "nombre": "Autoridad Nacional de Acuicultura y Pesca (AUNAP)",
            "descripcion": "Servicios para promover, acompañar y evaluar el desarrollo del sector, mediante la implementación de políticas, planes, estrategias y acciones orientadas a la protección, ordenación y sostenibilidad de los recursos pesqueros y de la acuicultura, que mejoren la calidad de vida de las comunidades",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 45 # 31-03 , BARRIO LA GABRIELA",
            "telefono": "60(1) 377 0500",
            "dominio": "https:www.aunap.gov.co directorio-regionales ",
            "email": "albeiro.ramirez@aunap.gov.co"
          },
          {
            "nombre": "Bancoldex",
            "descripcion": "Establecimiento de crédito bancario de caracter público, que opera como un banco de segundo piso, cuyo objeto principal es el de financiar las necesidades de capital de trabajo y activos fijos de proyectos o empresas viables",
            "tipo": "Otros",
            "tipoCliente": "Empresas",
            "direccion": "Cra. 13 No. 13-40, Centro Comercial Uniplex, Circunvalar, Oficina 405",
            "telefono": "(+57) (606) 349 67 30",
            "dominio": "https:www.bancoldex.com es pereira",
            "email": "contactenos@bancoldex.com"
          },
          {
            "nombre": "BASICO-CLINICA Y APLICADASCOL0021597",
            "descripcion": "1. Consolidar el grupo 2. Continuar con la línea de investigación estructuradas 3. Divulgar, a través de artículos, los resultados de la investigación.1.- Análisis de Variables Físicas, Fisiológicas y Psicomotoras 2.- Análisis del Movimiento 3.- Clínica Medica 4.- Corazón Sano y Riesgo Cardiovascular 5.- Evaluación del Ejercicio 6.- Medicina del Trabajo y Salud Ocupacional 7.- Riesgo Osteoarticular y Muscular 8.- Sarcopenia, Dinapenia, Ejercicio Físico y Nutrición ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "basicoclinicayaplicadas@utp.edu.co"
          },
          {
            "nombre": "BIODIVERSIDAD Y BIOTECNOLOGÍA COL0000719 ",
            "descripcion": "Consolidar el grupo de investigación científica en el conocimiento, utilización y conservación de la agrobiodiversidad con impacto regional y nacional. 1.- Agrobiodiversidad 2.- Biología Molecular 3.- Cultivo de Tejidos Vegetales 4.- Estrés Vegetal Biótico y Abiótico ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "utpCarrera 27 #10-02 Álamos Pereira",
            "email": "ubioteve@utp.edu.co"
          },
          {
            "nombre": "BIOECOS COL0184322",
            "descripcion": "Proponer y desarrollar propuestas de investigación encaminadas a la solución de problemas relacionados con la salud, la biodiversidad y la conservación de los ecosistemas, utilizando los resultados para proponer estrategias de solución que favorezcan programas de identificación, recuperación y reproducción de las especies, la prevención de enfermedades, monitoreo de ecosistemas, entre otros. Preocupados tanto por las poblaciones naturales y los ecosistemas como por la salud y el bienestar de los individuos en vida libre y en cautiverio.1.- Ecología y Biodiversidad 2.- Genética y reproducción animal 3.- Manejo y bienestar animal 4.- Morfofisiología animal comparada 5.- Nutrición y metabolismo animal 6.- Producción Pecuaria sostenible 7.- Salud animal individual y poblacional 8.- Sostenibilidad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "bioecos@googlegroups.com"
          },
          {
            "nombre": "Biología de la Conservación y biotecnología UNISARC COL0027679",
            "descripcion": "Estudiar la biodiversidad de la región a diferentes escalas espaciales y temporales. Proponer estrategias de manejo y conservación de la biodiversidad desde y para el territorio. Aplicar herramientas biotecnológicas para la solución de problemas relacionas con los diferentes sistemas biológicos1.- Biología de la conservación 2.- Biotecnología ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION UNIVERSITARIA SANTA ROSA DE CABAL UNISARCVereda el Jazmín kilómetro 4 Vía Santa Rosa de Cabal – Chinchiná",
            "email": "conservacion.unisarc@gmail.com"
          },
          {
            "nombre": "Biomedicina COL0159615",
            "descripcion": "Contribuir con el fortalecimiento de la investigación en la región del Eje cafetero en Colombia mediante el desarrollo de proyectos de investigación en biomedicina donde se involucren sujetos de la región.1.- Diagnóstico molecular de enfermedades infecciosas 2.- Salud Global 3.- Tanatopraxia y plastinación 4.- Toxico genética ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA AUTONOMA DE LAS AMERICAS Av. de las Américas #98 -56, Pereira, Risaralda",
            "email": "sandra.garzon@uam.edu.co"
          },
          {
            "nombre": "Biomolecular y pecuaria (BIOPEC) COL0111451 ",
            "descripcion": "Vincular y promover la participación permanente de estudiantes en las actividades de los semilleros. Estimular y motivar el interés académico y creativo de los participantes. Desarrollar propuestas de investigación innovadoras y de importancia para el sector agropecuario. 1.- Análisis de Alimentos con Potencial en la Alimentación Animal 2.- Enfermedades de Animales 3.- genética, mejoramiento animal y modelación estadística 4.- Investigación en Reproducción 5.- Nutrición Animal y Calidad en Leche y Carne 6.- Nutrición y Medio Ambiente 7.- Producción Pecuaria",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "utpCarrera 27 #10-02 Álamos Pereira",
            "email": "juancorrales@utp.edu.co"
          },
          {
            "nombre": "BIOTRISKEL BIOTECHNOLOGIES COL0180468",
            "descripcion": "Realizar investigación, teórica y aplicada, con preferencia en temas de economía y desarrollo, Biotecnología y Ciencias de la Vida.1.- Biomecánica 2.- Desarrollo de Software 3.- Farmacia 4.- Medicina regenerativa 5.- Microbiología Industrial ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "BIOTRISKEL SAS, Cl. 14 #16-71, Pereira, Risaralda",
            "email": "BIOTRISKEL@GMAIL.COM"
          },
          {
            "nombre": "Busscar",
            "descripcion": "Empresa dedicada al diseño y fabricación carrocerías para buses",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Kilometro 14 Via Cerritos",
            "telefono": "57-60-6-349-6060",
            "dominio": "https:www.busscar.com.co es ",
            "email": "coobusscar@busscar.com.co"
          },
          {
            "nombre": "Café Y Compañía S.A",
            "descripcion": "Servicio de producción y comercialización de café procesado.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Avenida 30 de Agosto #87-88",
            "telefono": "(606) 337 6668",
            "dominio": "https:cafemariscal.com.co ",
            "email": "info@cafemariscal.com.co"
          },
          {
            "nombre": "Cámara de comercio de Dosquebradas",
            "descripcion": "La Cámara de Comercio de Dosquebradas ofrece: formación empresarial certificada, servicios de consultoría, campañas de promoción del comercio y apoyo en identidad en línea.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Calle 41 No. 15 - 25",
            "telefono": "57-60-6-322-8807",
            "dominio": "http:www.camado.org.co ",
            "email": "contactenos@camado.org.co"
          },
          {
            "nombre": "Cámara de comercio de Pereira",
            "descripcion": "CCP, entidad sin fines de lucro, gestiona registros públicos y promueve la competitividad regional mediante capacitaciones y alianzas estratégicas.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 8 23-09, Local 10",
            "telefono": "57-60-6-338-7800",
            "dominio": "http:www.camarapereira.org.co",
            "email": "servicioalcliente@camarapereira.org.co"
          },
          {
            "nombre": "Cámara de comercio Santa Rosa",
            "descripcion": "Es un actor clave en el desarrollo económico y comercial del municipio, destacándose como líder regional en la promoción del progreso y comercio.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Calle 14 No. 15-78, Piso 2",
            "telefono": "57-60-6-364-1615",
            "dominio": "http:www.camarasantarosa.org ",
            "email": "secretaria@camarasantarosa.org"
          },
          {
            "nombre": "Campos Electromagnéticos y Fenómenos Energéticos-CAFÉ COL0073412",
            "descripcion": "Analizar los fenómenos electromagnéticos mediante el uso de herramientas computacionales y su integración a software de diseño asistido por computador. - Investigar y desarrollar herramientas computacionales de inteligencia artificial y computación blanda aplicada a señales, sistemas. - Investigar usos, modelos, comportamientos, control y mejoras de las máquinas y dispositivos eléctricos y electrónicos. 1.- Dispositivos, máquinas y componentes electrónicos y eléctricos en industrias 4.0 2.- Estabilidad y optimización de los sistemas eléctricos. 3.- Evaluación y definición de política energética. 4.- Modernización, operación y control de sistemas energéticos con alta penetración de FNCER. 5.- Tecnología, Ciencia y Sociedad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "almo@utp.edu.co"
          },
          {
            "nombre": "CENICAFE Pereira",
            "descripcion": "Genera conocimiento y tecnologías enfocados en aumentar la productividad, competitividad, sostenibilidad y rentabilidad de la de la caficultura del eje cafetero",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Vda Retiro Via El, EL ESTANQUILLO",
            "telefono": 3290360,
            "dominio": "https:risaralda.federaciondecafeteros.org glosario cenicafe ",
            "email": "Hector.Alvarez@cafedecolombia.com"
          },
          // {
          //   "nombre": "CENTRO DE ATENCIÓN AL SECTOR AG​ROPECUARIO",
          //   "descripcion": "Infraestructura dotada de ambientes teórico prácticos (talleres y laboratorios) para que tanto aprendices como instructores puedan desarrollar sus labores de manera eficiente.",
          //   "tipo": "Formación y capacitación",
          //   "tipoCliente": "Personas Naturales",
          //   "direccion": "Cra. 8ª No. 26 - 79",
          //   "telefono": "3135800 Ext: 63270",
          //   "dominio": "https:caisarisaralda.blogspot.com "
          // },
          {
            "nombre": "Centro De Celulas Madre Y Biotecnologia S.A.S. (CEMAB)",
            "descripcion": "Empresa dedicada a servicios de obtención, procesamiento, comercialización y almacenamiento de células madre con fines terapéuticos y de investigación con base científica y tecnológica",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 14 Nro. 23 - 41",
            "telefono": "(6) 3210051",
            "dominio": "https:www.facebook.com celulasmadrecemab ?locale=es_LA",
            "email": "info@cemab.com.co"
          },
          // {
          //   "nombre": "CENTRO DE COMERCIO Y SERVICIOS",
          //   "descripcion": "Ofrece tecnologías como Gestión del Comercio Exterior y Contable, y técnicos como Servicios de Restaurante y Bar, Recursos Humanos",
          //   "tipo": "Formación y capacitación",
          //   "tipoCliente": "Personas Naturales",
          //   "direccion": "Cra. 8ª No. 26 - 79",
          //   "telefono": "3135800 Ext: 63200",
          //   "dominio": "https:comerciorisaralda.blogspot.com "
          // },
          // {
          //   "nombre": "CENTRO DE DISEÑO E INNOVACIÓN TECNOLÓGICA INDUSTRIAL",
          //   "descripcion": "Esta ubicada en Dosquebradas, y ofrece tecnologías en Confección, Fabricación, Gestión de Redes, Mantenimiento y programas técnicos en Control de Calidad, Implementación y Mantenimiento",
          //   "tipo": "Formación y capacitación",
          //   "tipoCliente": "Personas Naturales",
          //   "direccion": "Transv. 7 Calle 26 Barrio Santa Isabel",
          //   "telefono": "3113700 Ext: 63360",
          //   "dominio": "https:senarisaraldadosquebradas.blogspot.com "
          // },
          {
            "nombre": "Centro de especialistas de Risaralda",
            "descripcion": "Abarca especialidades en alergia, asma, inmunología y pediatría, brindando atención integral a los pacientes",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Personas Naturales",
            "direccion": "Carrera 5a No. 18-33",
            "telefono": "(+57) (6) 335 9884 - 3359885 - 3359886",
            "dominio": "https:centrodeespecialistas.com.co ",
            "email": "administracion@centrodeespecialistas.com.co"
          },
          {
            "nombre": "Centro de Innovación y Desarrollo Tecnológico de la Manufactura y la Metalmecánica (CINDETEMM)",
            "descripcion": "Proporciona servicios y soluciones tecnológicas para impulsar la innovación, competitividad y calidad en la industria regional del eje cafetero, aprovechando recursos nacionales",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CALLE 35 16 33 BARRIO GUADALUPE",
            "telefono": 3148683844,
            "dominio": "https:www.cindetemm.org.co ",
            "email": "CONTACTO@CINDETEMM.ORG.CO"
          },
          {
            "nombre": "Centro de Innovación y Desarrollo Tecnológico Universidad Tecnológica de Pereira",
            "descripcion": "Ofrece tecnologías para la Industria 4.0, servicios de apoyo a la innovación y emprendimiento, desarrollo de proyectos y formación continua, contribuyendo a la transformación productiva del departamento y el desarrollo de los sectores estratégicos de la región.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 27 No. 10-02 Edificio 15, Bloque D Oficina 405",
            "telefono": "(+57) (606) 313 7316",
            "dominio": "https:cidt.utp.edu.co ",
            "email": "cidt@utp.edu.co"
          },
          {
            "nombre": "Centro de Inteligencia de Mercados COL0064923",
            "descripcion": "Crear conocimiento disciplinar e investigativo a partir del estudio y aplicación de teorías, métodos y herramientas propias de las Ciencias Administrativas, Económicas y Financieras, dirigido a temas prioritarios del Desarrollo Organizacional y territorial, la innovación educativa y la creación de valor social de las organizaciones del Eje Cafetero.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Areandina Cl. 24 #8-55, Pereira, Risaralda",
            "email": "durrea@areandina.edu.co"
          },
          {
            "nombre": "CHEC Grupo EPM",
            "descripcion": "Empresa de servicios públicos de generación, distribución y comercialización de energía electrica",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Estación Uribe Km 2 Autopista del Café",
            "telefono": "(57) 60 6 889 90 00",
            "dominio": "https:www.chec.com.co ",
            "email": "chec@chec.com.co"
          },
          {
            "nombre": "CIAB COL0121879 ",
            "descripcion": "Consolidar al grupo mediante la cualificación del dialogo interdisciplinario para generar conocimiento que permita contribuir de manera efectiva a un desarrollo social sustentable Desarrollar investigación e innovación biotecnológica que viabilice la oportunidad de conservar los recursos naturales y promover una agricultura sustentable como estrategia para el desarrollo socio económico del país.1.- Biodiversidad y recursos genéticos 2.- Biotecnología 3.- Desarrollo rural 4.- Gestión y manejo ambiental 5.- Relación Agua, Suelo, Planta, Atmosfera y Sociedad. ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "unadCarrera 23 con Diagonal 25F Barrio Milán",
            "email": "sandra.montenegro@unad.edu.co"
          },
          {
            "nombre": "Ciencias Administrativas y Desarrollo Rural -CIADRU- COL0224089",
            "descripcion": "Grupo de investigación centrado en las siguientes tematicas: 1.- Costos de producción 2.- Gestión y Desarrollo Agroempresarial 3.- Innovación Social y Gestión del Conocimiento Agroempresarial 4.- Tecnologías Agroindustriales Rurales 5.- Turismo rural y patrimonio",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION UNIVERSITARIA SANTA ROSA DE CABAL UNISARCVereda el Jazmín kilómetro 4 Vía Santa Rosa de Cabal – Chinchiná",
            "email": "anamaria.tabares@unisarc.edu.co"
          },
          {
            "nombre": "Clesus S.A.S",
            "descripcion": "Empresa dedicada al diseño, fabricación y venta de transformadores eléctricos tipo seco de potencia hasta 3.000 kVA y voltaje de hasta 35.000 voltios, para instalación en exteriores. Asimismo, al diseño, fabricación y venta de variadores de frecuencia, que se utilizan para alimentar motores de Media y Baja Tensión de hasta 2.000hp.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Entidad privadas",
            "direccion": "Calle 19 Nro. 9 50 Oficina 805 B Edificio Diario del Otun",
            "telefono": "57-60-6-334-3254",
            "dominio": "https:clesus.com.co ",
            "email": "info@clesus.com"
          },
          {
            "nombre": "Clínica Comfamiliar Risaralda",
            "descripcion": "Entidad de servicios dentro del campo de la Seguridad y Protección Social, que con fundamento en la subsidiaridad, la sostenibilidad, la equidad y la inclusión, permite el desarrollo integral de la población beneficiaria y la comunidad más vulnerable",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Avenida Circunvalar No. 3-01",
            "telefono": 3135600,
            "dominio": "https:www.comfamiliar.com ",
            "email": "ausalud@comfamiliar.com"
          },
          {
            "nombre": "Clínica Los Rosales",
            "descripcion": "IPS dedicada a la atención, prevención y cuidado de patologías en el territorio",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 9 Nro. 25 25",
            "telefono": "57-60-6-333-0380",
            "dominio": "https:www.facebook.com clinicalosrosalespereira ?locale=es_LA",
            "email": "scliente@clirosales.com"
          },
          {
            "nombre": "Clínica y Salud Mental COL0044537",
            "descripcion": "Desarrollar conocimiento científico de calidad en el área de la salud mental individual y colectiva, entendida desde sus componentes biológicos, psicológicos y sociales, a partir de la discusión, reflexión e investigación de problemáticas relevantes para el contexto local, regional, nacional e internacional, a través de los vínculos con otros grupos de investigación, redes académicas, programas de pre y posgrado1.- Neurociencia y Conducta, Neuropsicología. 2.- Psicoanálisis, Trauma y Síntomas Contemporáneos 3.- Psicología Clínica y de la Salud",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Católica de Pereira, Las Americas, Avenida Sur, Cra 21 #49-95, Pereira, Risaralda",
            "email": "clinicasalud.mental@ucp.edu.co"
          },
          {
            "nombre": "Clúster Aeronáutico del Eje Cafetero, de la Industria del Movimiento y del Sector Metalmecánico - Risaralda",
            "descripcion": "Facilita la colaboración entre empresas del sector metalmecánico y plástico en Dosquebradas, Pereira y Manizales, promoviendo la innovación, la competitividad y el desarrollo regional en la industria aeronáutica",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Cámara de Comercio de Dosquebradas",
            "telefono": 3176579293,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 51 show-initiatives",
            "email": "vicepresidente@camado.org.co"
          },
          {
            "nombre": "Clúster de Cafés Especiales Departamento de Risaralda",
            "descripcion": "Interrelacionadas mutuamente en los sentidos vertical, horizontal y colateral en torno a mercados, tecnologías – métodos, con el fin de consolidar un núcleo dinámico para este sector, mejorando su competitividad y fortaleciéndose entre sí con la ayuda y participación de todas sus instituciones, por medio del aprovechamiento de las oportunidades que ofrecen las redes y las cadenas de valor.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Clúster de Cafés Especiales Departamento de Risaralda",
            "telefono": 3104140490,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 123 show-initiatives",
            "email": "danielhc23@gmail.com"
          },
          {
            "nombre": "Clúster de Energía del Suroccidente",
            "descripcion": "Impulsa el desarrollo de la cadena productiva eléctrica regional, fortaleciendo la competitividad y contribuyendo al desarrollo socioeconómico mediante iniciativas colaborativas y proyectos estratégicos.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Universidad del Valle",
            "telefono": "316 528 91 75",
            "dominio": "https:redclustercolombia.gov.co initiatives_f 50 show-initiatives#:~:text=tiene%20como%20misi%C3%B3n%20Impulsar%20iniciativas,desarrollo%20sostenible%20de%20la%20regi%C3%B3n.",
            "email": "guillermo.aponte@correounivalle.edu.co"
          },
          {
            "nombre": "Clúster de Industrias Creativas del Eje Cafetero - Caldas",
            "descripcion": "Promueve nuevos enfoques asociativos para la gestión de los emprendimientos y las empresas culturales y creativas a través de procesos de formación, actividades de investigación, vínculos con los actores del sector y otros clúster tecnológicos, organización de ruedas de negocios, intercambio de conocimiento, soporte a la incubación e internacionalización de las industrias creativas.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Universidad de Caldas",
            "telefono": 3116799400,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 127 show-initiatives",
            "email": "clusterlab@ucaldas.edu.co"
          },
          {
            "nombre": "Cluster TIC del Triángulo del Café",
            "descripcion": "El \"Clúster TIC del Triángulo del Café\" es una iniciativa que busca que empresas del Eje Cafetero unan esfuerzos para potenciar el desarrollo tecnológico regional, con respaldo del Ministerio TIC.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Cámara de Comercio de Pereira",
            "telefono": 3128730341,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 89 show-initiatives#:~:text=El%20Cluster%20TIC%20del%20Tri%C3%A1ngulo,social%20propendan%20por%20la%20investigaci%C3%B3n",
            "email": "clusterticnetworkit@gmail.com"
          },
          {
            "nombre": "Co&Tex",
            "descripcion": "Empresa dedicada a la fabricación y comercialización de prendas de vestir con altos standares de calidad en los segmentos Masculino, Femenino y Kids en las categorias Formal, Casual, Jeanswear, Deportiva, Interior e Institucional.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 11 Nro. 17-27",
            "telefono": "57 6 3301036",
            "dominio": "https:www.coytex.com.co ",
            "email": "comercial@coytex.com.co"
          },
          {
            "nombre": "Coats Cadena Andina S.A.",
            "descripcion": "Empresa del sector manufacturero (Textil), fabricante de hilos industriales, que atiende a las industrias de indumentaria y calzado",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Avenida Santander Nro. 5 E 87",
            "telefono": "57-60-6-339-8200",
            "dominio": "https:cadenacoats.com ",
            "email": "william.cano@coats.com"
          },
          {
            "nombre": "Comisión Regional de Competitividad de Risaralda (CRCI)",
            "descripcion": "La Comisión Regional de Competitividad de Risaralda es un espacio donde entidades públicas, privadas y académicas colaboran para el desarrollo sostenible y competitivo. Su misión es impactar positivamente la región, buscando una sociedad más competitiva y una mejor calidad de vida.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Cra. 8 No. 23-09.Cámara de Comercio de Pereira - Piso 2",
            "telefono": "57 6063403030",
            "dominio": "https:www.crcrisaralda.org ",
            "email": "jmgonzalez@camarapereira.org.co"
          },
          {
            "nombre": "Comite Departamental de Cafeteros de Risaralda",
            "descripcion": "Busca maximizar los ingresos del productor de café, promoviendo una caficultura eficiente y sostenible. Financia garantías de compra, investigación, asistencia técnica y comercialización",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 9 #36-43",
            "telefono": "(6) 3290360",
            "dominio": "https:risaralda.federaciondecafeteros.org ",
            "email": "estela@arredondo@cafedecolombia.com"
          },
          {
            "nombre": "Comité Intergremial de Risaralda",
            "descripcion": "Es organismo privado conformado por los gremios económicos de producción agrícola, industrial, comercio, servicios y la construcción en Risaralda.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Cra.8 No.23-09",
            "telefono": "(6) 3341383",
            "dominio": "http:comiteintergremialrisaralda.blogspot.com ",
            "email": "gremio@une.net.co"
          },
          {
            "nombre": "COMUNICACION EDUCATIVA COL0001638",
            "descripcion": "1o. Plantear un enfoque no instrumental de la comunicación educativa, que haga de este campo un espacio de reflexión y experimentación permanente. 2o. Propiciar un acercamiento cuidadoso al conjunto de problemas que puedan ser pensados al relacionar los campos de la comunicación y la educación. 1.- Educación indígena 2.- La Comunicación y la Educación en procesos de transformación cultural. 3.- La Educación en los Medios y los Medios en la Educación 4.- Las nuevas tecnologías de la Información y la resolución de problemas educativos o su mejoramiento",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "olbedoya@utp.edu.co"
          },
          {
            "nombre": "Comunicación, educación y cultura - COL0031566",
            "descripcion": "Realizar procesos investigativos mediante la diseminación, la formación y la producción del conocimiento alrededor de tres líneas de investigación específicas.1.- Pensamiento Educativo 2.- Comunicación y culturas 3.- Pedagogía y Desarrollo Humano",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Católica de Pereira, Las Americas, Avenida Sur, Cra 21 #49-95, Pereira, Risaralda",
            "email": "comunicacioneducacionycultura@ucp.edu.co"
          },
          {
            "nombre": "Concejo Departamental de Ciencia Tecnología e Innovación (CODECTI)",
            "descripcion": "Asesorar al gobierno departamental, en la formulación, implementación y gestión de políticas públicas de ciencia, tecnología e innovación a nivel territorial.",
            "tipo": "Promoción y divulgación científica",
            "tipoCliente": "Centros o institutos de innovación",
            "email": "slmartinez@minciencias.gov.co"
          },
          {
            "nombre": "CONTROL AUTOMÁTICO COL0031477",
            "descripcion": "Los objetivos del grupo incluyen desarrollar y diseñar aplicaciones que involucren identificación de sistemas, control adaptable, control óptimo, problemas inversos dinámicos, estimación de estados y sus aplicaciones sobre una gran cantidad de sistemas físicos desde sistemas biológicos hasta sistemas de potencia.1.- Control Adaptativo 2.- Control Inteligente 3.- Control No Lineal 4.- Control estocástico 5.- Control Óptimo 6.- Desarrollo de ambientes virtuales 7.- Diseño e implementación de prototipos de hardware 8.- Estimación de estados 9.- Identificación de sistemas 10.- Problemas inversos dinámicos. ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "egiraldos@utp.edu.co"
          },
          {
            "nombre": "Cooperativa de Entidades de Salud de Risaralda- Coodesuris",
            "descripcion": "Se especializa en operaciones logísticas, gestión farmacéutica y provisión de servicios y tecnologías en salud, garantizando calidad y oportunidad para satisfacer las necesidades de los clientes.",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Av. 30 de agosto No. 87 - 298",
            "telefono": "(606) 351 54 66",
            "dominio": "https:www.coodesuris.com es ",
            "email": "comunicacion@coodesuris.com"
          },
          {
            "nombre": "Corporación Autónoma Regional de Risaralda (CARDER)",
            "descripcion": "Administrar el medio ambiente y los recursos naturales renovables en el Departamento de Risaralda y propender por su desarrollo sostenible, de conformidad con las disposiciones legales y las políticas del Ministerio de Ambiente y Desarrollo Sostenible.",
            "tipo": "Otros",
            "tipoCliente": "Corporaciones ambientales",
            "direccion": "Avenida Sur # 46-40",
            "telefono": "57-60-6-311-6511",
            "dominio": "http:www.carder.gov.co ",
            "email": "carder@carder.gov.co"
          },
          {
            "nombre": "Corporación Instituto de Administración y Finanzas (CIAF)",
            "descripcion": "brinda educación empresarial innovadora y de calidad, fomentando emprendimiento, creatividad y excelencia académica para profesionales del futuro",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Carrera 6 No 24-56",
            "telefono": "314 3400 100",
            "dominio": "https:www.ciaf.edu.co inicio.php",
            "email": "rectoria@ciaf.edu.co"
          },
          {
            "nombre": "Corporación Universitaria Santa Rosa de Cabal (UNISARC)",
            "descripcion": "forma profesionales capaces de gestionar iniciativas en turismo y patrimonio, destacando ecoturismo, turismo cultural y otras áreas",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "kilómetro 4 vía Santa Rosa de Cabal - Chinchiná",
            "telefono": 3137441102,
            "dominio": "https:unisarc.edu.co ",
            "email": "investigaciones@unisarc.edu.co"
          },
          {
            "nombre": "Crea-Inn S.A.S",
            "descripcion": "Desarrollar soluciones SaaS (Software as a Service) especializadas, amigables y versátiles para simplificar la gestión empresarial de nuestros clientes en todas sus etapas.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CARRERA 31 15 87 OFICINA 202",
            "telefono": 3217394334,
            "dominio": "https:www.crea-inn.com ",
            "email": "dir.comercial@crea-inn.com"
          },
          {
            "nombre": "CREER: Centro Regional del Estudios en Emprendimiento, Empresariado y Responsabilidad Social COL0115011",
            "descripcion": "Estudiar las variables que facilitan   impiden el desarrollo de una personalidad emprendedora y una vocación empresarial representativa en jóvenes y adultos del país y construir estrategias pedagógicas y metodologías específicas * Generar espacios de estudio, formación y diálogo en responsabilidad social en todas sus especialidades (corporativa, universitaria, entre otros) * Generar espacios de estudio, formación y diálogo en Gestión Ambiental Empresarial.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "gestora@sembrarfuturo.org"
          },
          {
            "nombre": "Crítica y Creación COL0147392",
            "descripcion": "Fundar, desde diferentes miradas teóricas, procesos de crítica y creación literarias, lingüísticas, pedagógicas, filosóficas, artísticas, entre otras, que posibiliten el encuentro, en la dimensión investigativa, de la didáctica, la sociocrítica, la escritura de ensayos y la creación de textos artísticos.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "william@utp.edu.co"
          },
          {
            "nombre": "DANE Centro Occidente",
            "descripcion": "Servicios de planeación, levantamiento, procesamiento, análisis y difusión de las estadísticas oficiales de Colombia.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 77 No. 21 - 69, Barrio Milán",
            "telefono": "(+57) 606 886 66 79",
            "dominio": "https:www.dane.gov.co index.php acerca-del-dane informacion-institucional organigrama territorial-centro-occidente-manizales",
            "email": "gaquinteroh@dane.gov.co"
          },
          {
            "nombre": "DERECHO, ESTADO Y SOCIEDAD COL0044107",
            "descripcion": "Generar y producir análisis críticos sobre los distintos problemas de carácter político, jurídico, social que se presentan en Colombia, desde los principios normativos democráticos del Derecho, la Sociedad y el Estado que permitan una reflexión seria y profunda sobre diversos componentes de la teoría jurídica, dando aportes significativos en la construcción del conocimiento universal científicamente válido y un conocimiento particular pertinente y relevantes. Generar transformaciones e impactos sociales a partir de la gestión y generación de conocimiento jurídico, social y político, que impacte de manera significativa en las realidades de contexto del grupo de investigación.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-100",
            "email": "daniel.moralesz@unilibre.edu.co"
          },
          {
            "nombre": "Desarrollo de Procesos Químicos COL0130724",
            "descripcion": "El Grupo de Desarrollo de Procesos Químicos (DPQ-UTP) tiene como objetivo primordial fortalecer la investigación en el mejoramiento de procesos y en el desarrollo de nuevos, que faciliten la obtención de productos y servicios que sean amigables con la naturaleza y a su vez, aporten en cubrir las necesidades de la comunidad. 1.- Control y simulación dinámica de los procesos químicos 2.- Modelamiento y Diseño de procesos químicos 3.- Simulación de Procesos Químicos y Biotecnológicos ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "melvin.duran@utp.edu.co"
          },
          {
            "nombre": "Desarrollo en Investigación Operativa (DINOP) COL0041992",
            "descripcion": "Estar a la vanguardia en las líneas de investigación que desarrolla. 1.- Análisis de datos2.- Análisis de riesgos3.- Gerencia de la cadena de abastecimiento4.- Green Transportation5.- Logística de transporte6.- Optimización en Sistemas Eléctricos7.- Planeación y control óptimo de procesos",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "magra@utp.edu.co"
          },
          {
            "nombre": "Desarrollo Humano y Organizacional COL0003383",
            "descripcion": "Generar investigaciones sobre el desarrollo humano y organizacional a todo nivel en instituciones públicas y privadas de diferentes índoles, permitiendo el cambio, innovación y liderazgo que promueva la cultura tecnológica, productividad y competitividad encaminada a la sostenibilidad y perdurabilidad en el medio. 1.- Cambio Innovación y Liderazgo 2.- Cultura Tecnológica, productividad y competitividad 3.- Educación y Gestión 4.- Reformas Laborales",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "desahu@utp.edu.co"
          },
          {
            "nombre": "Desofmat - COL0055969",
            "descripcion": "-Elaborar lecciones en diferentes tópicos del Calculo diferencial e integral, ecuaciones diferenciales, algebra lineal. - Contribuir con el estudio de nuevas herramientas computacionales que puedan servir de apoyo en la orientación de asignaturas que son abordadas de manera tradicional.1.- Ciencia de datos 2.- Sistemas dinámicos 3.- Software Matemático - TIC en la educación",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "lfalvare@utp.edu.co"
          },
          {
            "nombre": "Diseño y construcción de prototipos para experimentos de demostración COL0027008",
            "descripcion": "Crear un grupo interdisciplinario destinado discutir y analizar diferentes proyectos o prácticas de laboratorio en el campo de la física, para diseñar y construir prototipos que sirvan de aplicación a la física y a sus áreas afines, proporcionando; 1-Mayor confiabilidad en los resultados obtenidos. 2- Facilidad en el manejo de los equipos o prototipos. 3- Verificación de algunas las leyes físicas que rigen el universo. 4- Ampliación de cobertura para las tesis de la maestría. 6- Elaboración de guías o manuales de usuario.1.- Diseño y Construcción de Prototipos de Equipo de Demostración en Física. 2.- Enseñanza de la Física 3.- Materiales 4.- Metrología Aplicada",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "utpCarrera 27 #10-02 Álamos Pereira",
            "email": "ugo@utp.edu.co"
          },
          {
            "nombre": "E.S.E Salud Pereira",
            "descripcion": "Empresa Social del Estado - Salud Pereira es una entidad del orden municipal de origen público, con Primer Nivel de Atención en Salud",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 7A # 40-34",
            "telefono": "57-60-6-351-5252",
            "dominio": "http:www.saludpereira.gov.co ",
            "email": "correoese@saludpereira.gov.co"
          },
          {
            "nombre": "E.S.E. Hospital Mental Universitario de Risaralda (HOMERIS)",
            "descripcion": "Prestar servicios de salud mental a toda la comunidad del departamento incluida dentro de su zona de influencia, las áreas concretas investigativas, docencia, asistenciales, promoción, prevención, tratamiento y readaptación social",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Av. 30 de Agosto Cra. 13 # 87 – 76",
            "telefono": "57(6)337-3444",
            "dominio": "https:homeris.gov.co category comunicaciones ",
            "email": "info@homeris.gov.co"
          },
          {
            "nombre": "Ecología, Ingeniería y Sociedad COL0079917",
            "descripcion": "Realizar proyectos de investigación y extensión de alto impacto social y ambiental -Propender por el fortalecimiento del grupo mediante la diversificación de sus alianzas y fuentes de financiación -Desarrollar proyectos de investigación y extensión que permitan la cualificación de la enseñanza en todos sus niveles, con especial interés en aportar a la consolidación de programas de posgrado.1.- Agroecología y soberanía alimentaria 2.- Biodiversidad y Servicios Ecosistémicos 3.- Ecología de los Ecosistemas Andinos 4.- Educación y Ciencia Ciudadana 5.- Ingeniería Ecológica",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "jmc@utp.edu.co"
          },
          {
            "nombre": "Educación y Desarrollo Humano COL0027198",
            "descripcion": "Desarrollar ciencia, tecnología, innovación y cultura en el campo de la educación, las didácticas, la pedagogía y el desarrollo humano. Formar docentes, estudiantes y egresados como profesionales reflexivos e investigadores en lo pedagógico, didáctico y o el desarrollo humano.1.- Educación inclusiva y didácticas flexibles 2.- Escuela, Conflicto y sociedad 3.- Pedagogía, didácticas y TIC",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mgutierrez@utp.edu.co"
          },
          {
            "nombre": "Educación y Tecnología COL0053287",
            "descripcion": "Consolidar un grupo de investigación que aporte desde las líneas de investigación propuestas a reflexionar y transformar las prácticas educativas con la mediación de las TIC. Formular y desarrollar proyectos de investigación acordes a los diversos contextos buscando fortalecer y potenciar otras formas de enseñar y de aprender, que aporten a nuestra universidad y el contexto nacional e internacional en general. 1.- Diseño y evaluación de propuestas didácticas 2.- Uso educativo de las TIC",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "marthace@utp.edu.co"
          },
          {
            "nombre": "Educación, sujeto y cultura COL0167439",
            "descripcion": "Desarrollar investigaciones enmarcadas en las líneas institucionales del sistema de investigaciones de UNIMINUTO, desde las cuales se aborden problemáticas locales, regionales o nacionales que involucran el sujeto, la cultura, y la educación. 1.- Educación, Cognición e Inclusión2.- Salud Mental en el contexto educativo y social",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UNIMINUTOKM 11 Vía Pereira - Cerritos, Sector Galicia",
            "email": "grupoinvestigaciongiese@gmail.com"
          },
          {
            "nombre": "EDUMEDIA-3 COL0181115",
            "descripcion": "Desarrollar procesos investigativos relacionados con el Área de Educación y medios, con el fin de aportar a la consolidación del PEP y del PDI, con relación a la Creación y transformación del conocimiento, Generación de Desarrollo social y Desarrollo institucional, en la Universidad Tecnológica de Pereira.1.- (Auto)medialidad 2.- Alfabetización mediática e informacional (AMI) 3.- Autobiografía, medios y educación 4.- Educación mediada, mediática y mediatizada",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "edumedia-3@utp.edu.co"
          },
          {
            "nombre": "Electrofisiología COL0004264",
            "descripcion": "Realizar trabajo interdisciplinario en el área de la electrofisiología. Desarrollar trabajo de investigación en el área del análisis de señales fisiológicas obtenidas de seres humanos bajo diferentes condiciones o patologías. 1.- Análisis de bioseñales 2.- Biomédica 3.- Efectos físicos de los CEM-NI sobre los seres humanos 4.- Electrofisiología Computacional 5.- Enseñanza de la metrología 6.- Estados alternos de conciencia 7.- Instrumentación y análisis de señales ECG 8.- Metrología de campos electromagnéticos 9.- Radiación Electromagnética 10.- Termografía biomédica 11.- metrología electro médica ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mmedina@utp.edu.co"
          },
          {
            "nombre": "Electrónica de Potencia COL0025979",
            "descripcion": "Difundir los conocimientos y los avances en el campo de la Electrónica de Potencia1.- Aseguramiento de la calidad 2.- Calidad de Energía 3.- Conversión de Energía Electromecánica y Electromagnética 4.- Convertidores Orientados Hacia la Enseñanza 5.- Convertidores de Potencia 6.- Energías Renovables y SmartGrids 7.- Estabilidad Dinámica de Sistemas Eléctricos 8.- Sistemas de Transmisión Flexible en Corriente Alterna (FACTS) ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "alalzate@utp.edu.co"
          },
          {
            "nombre": "Empresa de Energía de Pereira S.A. E.S.P.",
            "descripcion": "Empresa de servicios públicos domiciliarios mixta, realiza actividades de generación, distribución y comercialización de energía eléctrica.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 10 Nro. 17 35 Edificio Torre Central",
            "telefono": "57-60-6-315-1515",
            "dominio": "https:www.eep.com.co es ",
            "email": "smvasquezc@eep.com.co"
          },
          {
            "nombre": "ENGINEERING PHYSICS - INGENIERIA FISICA COL0185437",
            "descripcion": "1.- Capítulo Antioquia de Ingeniería Física2.- Capítulo Cauca de Ingeniería Física3.- Capítulo Pereira de Ingeniería Física4.- Estadística bayesiana5.- MONITOREO AMBIENTAL6.- Sputtering technique7.- Thermal conductivity measurement",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "sociedadcolombianaingenieriafisica@utp.edu.co"
          },
          {
            "nombre": "Enjambre empresarial Novitas de Risaralda",
            "descripcion": "NOVITAS ofrece integración empresarial y tecnológica para fortalecer el desarrollo del sector software en Risaralda y consolidar a Pereira como territorio inteligente.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira",
            "telefono": 3104711559,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 40 show-initiatives",
            "email": "silvia.botero@utp.edu.co"
          },
          {
            "nombre": "Entreverdes",
            "descripcion": "Entreverdes, una asociación sin ánimo de lucro en Pereira, promueve la caficultura sustentable, beneficiando a 204 familias productoras de café especial. Con un enfoque en prácticas agrícolas responsables. Tambien Entreverdes comercializa café pergamino de alta calidad.",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Cra. 9 # 36-43",
            "telefono": "(6) 329 0360 Ext. 146-148",
            "dominio": "https:entreverdes.com.co ?i=1",
            "email": "info@entreverdes.co"
          },
          {
            "nombre": "EPIDEMIOLOGÍA SALUD Y VIOLENCIA COL0026726",
            "descripcion": "Identificar las características epidemiológicas de la población del eje cafetero 1.- Cáncer 2.- Enfermedades infecciosas 3.- Evaluación de tecnologías diagnósticas 4.- Salud y violencia ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jose01william@gmail.com"
          },
          {
            "nombre": "Estadística e Investigación Social (ISE) COL0080865",
            "descripcion": "La comprensión e interpretación de la teoría y herramientas estadísticas que sirvan en la investigación en ciencias sociales y de la educación. o Aportar en el desarrollo teórico-práctico de la estadística para las ciencias sociales y de la educación a nivel regional. 1.- Línea de Enseñanza de la Estadística y la Probabilidad 2.- Línea de Enseñanza de la Geometría y Medición 3.- Línea de Enseñanza del Pensamiento Numérico y Variacional 4.- Línea de Investigación Social 5.- Línea de Pedagogía en el área de Educación Matemática",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "romaes@utp.edu.co"
          },
          {
            "nombre": "Estética y Expresión COL0104869",
            "descripcion": "Centrar el estudio de la Estética en el ámbito de la expresión como elemento fundante del arte desde sus labores en la Grecia antigua como téchne y mimesis, pasando por la modernidad como representación y proyectándose hacia la época actual como estética expresiva.1.- Estética contemporánea 2.- Fenomenología del cuerpo 3.- la tentación de bouvard y pécuchet 4.- Línea en estética moderna: Hegel y la Religión del Arte. 5.- Línea en estética antigua: Platón y Aristóteles. 6.- Producción artística ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "luisquijano@utp.edu.co"
          },
          {
            "nombre": "Estudio y aplicación de herramientas estadísticas modernas en la solución de problemas del entorno COL0021809",
            "descripcion": "Realizar estudios e investigaciones que permitan mediante la información recogida la toma de decisiones adecuadas en la solución de problemas del entorno (Problemáticas Económicas, sociales, políticas, de educación etc)1.- Deserción y Permanencia Estudiantil 2.- Estadística multivariada y sus aplicaciones",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "utpgiem@gmail.com"
          },
          {
            "nombre": "Estudios del Lenguaje y la Educación COL0021523",
            "descripcion": "Aportar al conocimiento del lenguaje mediante la investigación teórica y aplicada y coadyuvar con los procesos formativos sobre el lenguaje, la comunicación y la educación. 1.- Apoyo a la investigación 2.- Lenguaje y Comunicación 3.- Lenguaje y Educación 4.- Lenguaje y Sociedad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mireyace@yahoo.com"
          },
          {
            "nombre": "Estudios económicos y administrativos COL0031922",
            "descripcion": "1.Impulsar y consolidar un proceso sistemático de investigación. 2.Conocer los procesos culturales y económicos que a lo largo de la historia de la región. 1.- Desarrollo empresarial e innovación 2.- Estudios del desarrollo humano y región 3.- Finanzas 4.- Negocios y relaciones internacionales",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Católica de Pereira, Las Americas, Avenida Sur, Cra 21 #49-95, Pereira, Risaralda",
            "email": "catalina1.ramirez@ucp.edu.co"
          },
          {
            "nombre": "Estudios Metodológicos para la Enseñanza de la Matemática y el uso de las Nuevas Tecnologías de la Información y la Comunicación - COL0038039",
            "descripcion": "Diseñar propuestas metodológicas que contribuyan a mejorar el Proceso de Enseñanza-Aprendizaje en cursos del área de Matemáticas, incorporando las Tecnologías de la Información y las Comunicaciones y que motive al estudiante de la Universidad Tecnológica de Pereira para que tenga un mejor aprovechamiento de los conocimientos adquiridos en dichos cursos y a su vez les sirvan como una herramienta en el planteamiento o solución de problemas, al conocer algunas de sus aplicaciones.1.- Desarrollo de Software Educativo 2.- Educación Matemática",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "vuzuriaga@utp.edu.co"
          },
          {
            "nombre": "Estudios políticos y jurídicos COL0140462",
            "descripcion": "Producir conocimiento científico sobre la política, lo político y los estudios jurídicos. 1.- Sujeto político.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "miguel85@utp.edu.co"
          },
          {
            "nombre": "Estudios Regionales sobre Literatura y Cultura - COL0034915",
            "descripcion": "Objetivos: 1. Desarrollar una Mirada Cultural en torno a fenómenos estético-literarios propios de regiones latinoamericanas 2.Fortalecer las miradas críticas y de recepción en torno a tradiciones literarias. 3. Profundizar en el conocimiento del fenómeno estético, literario y cultural denominado Grecoquimbaya o Grecolatino. 1.- La Mirada Cultural 2.- Literatura y Contexto social 3.- Música, cultura y didáctica 4.- Procesos de escritura creativa en los campos de la ficción y el periodismo",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "rigoroso@utp.edu.co"
          },
          {
            "nombre": "Federación Clúster Textil Confección Eje Cafetero - Risaralda",
            "descripcion": "Se enfoca en mejorar la productividad y rentabilidad de sus miembros mediante el fortalecimiento del equipo humano, respaldado por empresas, academia y gobierno, para impulsar el desarrollo regional y nacional.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Federación Cluster JUNTOS Textil Confección",
            "telefono": 3164817192,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 69 show-initiatives#:~:text=Somos%20una%20Federaci%C3%B3n%20Cluster%20conformada,los%20entes%20gubernamentales%2C%20contribuyendo%20al",
            "email": "leonardoarias@industriasmclaren.com"
          },
          {
            "nombre": "FENALCO Seccional Risaralda",
            "descripcion": "Agremiación que ofrece la representatividad al comercio organizado ante los entes públicos y privados, para alcanzar un mayor desarrollo de la actividad mercantil que ejerce.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Cra. 7 # 16-50 Piso 3",
            "telefono": 3158897747,
            "dominio": "https:fenalcorisaralda.com ",
            "email": "atencionafiliado@fenalcorisaralda.com"
          },
          {
            "nombre": "Fenómeno Religioso COL0063579",
            "descripcion": "A partir de una adecuada conceptualización de la religión y una valoración teológica y filosófica de la misma, crear una dinámica académica de conocimiento y estudio del fenómeno religioso con sus manifestaciones, tendencias, características e implicaciones tanto sociales como éticas, con el fin de contribuir al desarrollo de la identidad regional y a su desarrollo cultural y humano, y al cumplimiento de la misión de la Iglesia.1.- El fenómeno religioso. Perspectiva teológica, socio cultural y pastoral 2.- Filosofía y religión",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Católica de Pereira, Las Americas, Avenida Sur, Cra 21 #49-95, Pereira, Risaralda",
            "email": "ceneida.alfonso@ucp.edu.co"
          },
          {
            "nombre": "FIDEE COL0107412",
            "descripcion": "Identificar, describir y analizar las principales teorías y conceptos sobre complejidad organizacional. Permitir, la construcción colectiva de los conocimientos que van conformando tanto el talento individual como organizacional. 1.- Capacidades dinámicas 2.- Direccionamiento estratégico 3.- Gestión del Conocimiento",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "fideeFUNDACION PARA LA INVESTIGACION Y EL DESARROLLO EDUCATIVO EMPRESARIAL",
            "email": "manuelalfonsogarzon@fidee.org"
          },
          {
            "nombre": "Filosofía Posmetafísica COL0004907",
            "descripcion": "- Explorar las posibilidades abiertas por el lenguaje literario para dar cuenta de la complejidad inaudita de la existencia. - Repensar la antropología que nos compete y discutir sus implicaciones alrededor de la siguiente idea: Somos tiempo y lenguaje.1.- Antropología paradójica 2.- El tiempo 3.- Giro Lingüístico 4.- Relaciones Filosofía-Literatura",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "julserna@utp.edu.co"
          },
          {
            "nombre": "Filosofía y Escepticismo COL0083535",
            "descripcion": "El grupo de investigación en Filosofía y Escepticismo pretende identificar líneas de transversalidad investigativa a partir de las cuales la filosofía sea abordada por medio de disciplinas tales como la literatura y el arte. De igual manera, el grupo establece que tales conexiones no se presentan como simples ayudas metodológicas dentro del abordaje de la filosofía sino que por el contrario, se asumen como instancias totalmente imprescindibles dentro del horizonte filosófico actual.1.- Bioética y Biotecnología 2.- Estética y Filosofía del Arte 3.- Filología Clásica 4.- Filosofía antigua 5.- Filosofía y Literatura 6.- Filosofía y pedagogía 7- Historia de la Filosofía 8.- Investigación filosofía y mujer 9.- Ética y escepticismo ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "alfredoabad@utp.edu.co"
          },
          {
            "nombre": "FILOSOFIA Y MEMORIA COL0077242",
            "descripcion": "Propiciar un conocimiento y reflexión acerca de los problemas contemporáneos del estado, la sociedad y las ideologías desde una perspectiva filosófica. indagar sobre la tensión que se da entre historia y memoria. propiciar la interdisciplinariedad entre ciencias sociales, educación y filosofía.1.- Imagen y Memoria 2.- Memoria histórica. 3.- Memoria y Testimonio 4.- Nuevo Pensamiento Judío 5.- Pedagogía y Memoria 6.- Teoría Crítica",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "alveos@gmail.com"
          },
          {
            "nombre": "FISURA COL0082028",
            "descripcion": "Contribuir a la generación, circulación, distribución y gestión de conocimientos desde el campo de la comunicación y la cultura, y articuladas a iniciativas de las ciencias sociales y humanas a través de las tres sublíneas de investigación del programa de Comunicación Social y la Maestría en Comunicación de la UNAD.1.- Comunicación y desarrollo 2.- Gestión de la comunicación 3.- Redes Sociales y Comunicación. 4.- comunicación, educación y tecnología",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unad Carrera 23 con Diagonal 25F Barrio Milán",
            "email": "mauricio.vera@unad.edu.co"
          },
          {
            "nombre": "Frigotun S.A.S",
            "descripcion": "Empresa dedicada a la transformación de las especies bovinas, bufalina y porcinas, en productos y derivados cárnicos aptos para el consumo humano",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Kilometro 3 Via Marsella",
            "telefono": "57-60-6-329-8000",
            "dominio": "https:frigotun.com ",
            "email": "info@frigotun.com"
          },
          {
            "nombre": "Frisby S.A.",
            "descripcion": "Cadena de restaurantes de pollo frito",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 7 Nro. 24 74",
            "telefono": "57-60-6-330-1300",
            "email": "lira56@yahoo.com"
          },
          {
            "nombre": "Fundación Enfances",
            "descripcion": "Promover, divulgar y restituir los derechos humanos, haciendo especial énfasis en los derechos de la infancia y la construcción de paz y ciudadanía.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Cl. 16 Este #12-1",
            "telefono": 63207975,
            "dominio": "https:enfances232.org ",
            "email": "enfances232@yahoo.com"
          },
          {
            "nombre": "Fundación Frisby",
            "descripcion": "Desarrollar programas y proyectos de educación formal, formación en pedagogías afectivas, cultura emprendedora, habilidades para la vida e inclusión productiva.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Sociedad",
            "direccion": "Av. 30 de Agosto #9039",
            "telefono": "310 8925189",
            "dominio": "https:www.fundacionfrisby.com ",
            "email": "fundacion@frisby.gov.co"
          },
          {
            "nombre": "Fundación Natura",
            "descripcion": "Conservar y recuperar la biodiversidad y los beneficios que esta presta a la sociedad en paisajes naturales e intervenidos, para promover territorios, social y ecológicamente resilientes a los cambios ambientales, a través de soluciones a los retos del desarrollo humano basadas en la naturaleza.",
            "tipo": "Otros",
            "tipoCliente": "Corporaciones ambientales",
            "direccion": "Cr 21 # 39-43",
            "telefono": "57-60-1-245-5700",
            "dominio": "https:natura.org.co ",
            "email": "fundacionnatura@natura.org.co"
          },
          {
            "nombre": "Fundación Sembrar Futuro",
            "descripcion": "Promover, fomentar y desarrollar programas y proyectos que contribuyan al crecimiento personal de niños, niñas, jóvenes, familias, adultos mayores y comunidad en general, impartiendo educación formal, educación informal y educación para el empleo",
            "tipo": "Apropiación social de conocimiento",
            "tipoCliente": "Sociedad",
            "direccion": "Cra 31 No. 15-87 oficina 202",
            "telefono": 3217394334,
            "dominio": "https:www.sembrarfuturo.org ",
            "email": "director@sembrarfuturo.org"
          },
          {
            "nombre": "Fundación Universitaria Autónoma de las Américas",
            "descripcion": "Ofrece programas de pregrado y postgrado orientados a contribuir con la formación humana en 6 áreas: académica, salud, desarrollo humano, promoción socioeconómica, cultura, deportes y recreación",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Avenida de las Américas No 98-56 Sector Belmonte",
            "telefono": "(606) 320 03 03",
            "dominio": "https:www.uam.edu.co pereira ",
            "email": "jose.navarrete@uam.edu.co"
          },
          {
            "nombre": "Fundación Universitaria Comfamiliar Risaralda",
            "descripcion": "Ofrece programas de tecnicos, porfesionaes y especializaciones basada en administración, contabilidad y finanzas.",
            "direccion": "Carrera 5 # 21-30",
            "telefono": "(57) 6 3172400",
            "dominio": "https:uc.edu.co ",
            "email": "investigacion@uc.edu.co"
          },
          {
            "nombre": "Fundación Universitaria del Área Andina Sede Pereira",
            "descripcion": "Ofrece una diversa oferta académica en ciencias humanas, con cursos, pregrados y posgrados que fomentan el pensamiento crítico y reflexivo para un desarrollo sostenible",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Calle 24 N° 8-55",
            "telefono": "(606) 3401516",
            "dominio": "https:www.areandina.edu.co sedes-y-csu seccional-pereira",
            "email": "dserna6@areandina.edu.co"
          },
          {
            "nombre": "Fundación YMCA Risaralda",
            "descripcion": "Empoderar a los y las jóvenes, la familia y la comunidad, en programas, proyectos y servicios que propendan por su formación, desarrollo integral y bienestar social",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Cra. 4 #23-50",
            "telefono": "310 4958910",
            "dominio": "https:www.ymcarisaralda.org ",
            "email": "comunicacionesrda@ymcacolombia.org"
          },
          {
            "nombre": "GAOPE COL0084569",
            "descripcion": "Consolidar herramientas que permitan desarrollar modelos matemáticos que representen de forma eficiente situaciones empresariales para entrar a resolverlos. 1.- Confiabilidad 2.- Logística 3.- Minería de datos 4.- Optimización Exacta y aproximada 5.- Planeación y gestión óptima de procesos 6.- Procesos Estocásticos 7.- Transporte ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "elianam@utp.edu.co"
          },
          {
            "nombre": "GEDNOL COL0055709",
            "descripcion": "Generar conocimiento orientado al fortalecimiento de la docencia, la investigación y la extensión desde la modelación matemática y simulación de sistemas. - Análisis y aplicación de teorías, metodologías y herramientas de la modelación y simulación de problemas no lineales. 1.- Análisis Estocástico para Ecuaciones No Lineales. 2.- Análisis Funcional No Lineal 3.- Análisis No Lineal con Aplicaciones en Finanzas 4.- Ecuaciones Diferenciales Fraccionarias 5.- Ecuaciones Diferenciales No Lineales 6.- Ecuaciones Diferenciales con Retardo 7.- Educación Matemática 8.- Física Matemática 9.- Métodos Cuasi-Analítico-Numéricos Para EDOs y EDPs No Lineales 10.- Métodos Numéricos Para Modelos No Lineales 11.- Métodos topológicos (Teoremas de Punto Fijo y Teoría de Grado) 12.- Sistemas Dinámicos 13.- Teoría de Perturbaciones en Modelos No Lineales ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "ppablo@utp.edu.co"
          },
          {
            "nombre": "GEIO COL0008094",
            "descripcion": "Facilitar y potenciar los procesos de enseñanza-aprendizaje de la ingeniería industrial y afines, a través de la investigación, desarrollo e implementación de herramientas pedagógicas constructivistas, como lúdicas y otras actividades que involucran activamente al estudiante con sus pares y docentes, en la construcción del conocimiento y en la puesta en práctica de conceptos y competencias.1.- Cadenas de Suministro 2.- Economía y Finanzas -Estudio del riesgo y conformación de portafolios. 3.- Educación en Ingeniería 4.- Gestión Ambiental 5.- Investigación de Operaciones y Estadística 6.- Mercadeo y Administración 7.- Organizaciones empresariales 8.- Pensamiento Sistémico 9.- Sistemas Integrados de Manufactura ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "geio@utp.edu.co"
          },
          {
            "nombre": "GEIS COL0128369",
            "descripcion": "Conformado en el 2006 e inscrito en la plataforma Scienti en el 2007, con la participación de docentes investigadores del Programa de Derecho. El grupo se crea como respuesta a las necesidades de investigación jurídica de la región. En esa línea, el grupo está orientado por un imperativo estratégico institucional: Transformación social, gestión ambiental y desarrollo territorial. 1.- Derecho de la empresa 2.- Derecho y Sociedad 3.- Derechos Humanos y Pluralismo jurídico",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Areandina Cl. 24 #8-55, Pereira, Risaralda",
            "email": "maserna5@areandina.edu.co"
          },
          {
            "nombre": "GELE. GRUPO DE ESTUDIO EN LECTURA Y ESCRITURA COL0067943",
            "descripcion": "General Incursionar en los procesos y productos de la expresión oral y escrita, desde todo lo que implican sus estructuras lógicas, discursivas, para la realización de proyectos de investigación, propuestas de capacitación y publicaciones.1.- Escritura 2.- Lectura 3.- Lengua materna 4.- Operaciones intelectuales 5.- Oralidad 6.- Patologías del lenguaje",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "magu@utp.edu.co"
          },
          {
            "nombre": "GEOMETRIA Y PROBABILIDAD - COL0127219",
            "descripcion": "Este grupo de investigación tiene como objetivo principal estudiar y desarrollar aplicaciones de problemas de interés en la geometría Integral. Para tal propósito se vinculan docentes expertos en el área y se buscara trabajar con estudiantes de pregrado o de posgrado de la Universidad Tecnológica Pereira.1.- Geometría Diferencial 2.- Probabilidad y Estadística",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "carlos10@utp.edu.co"
          },
          {
            "nombre": "GERENCIA DEL CUIDADO COL0044419",
            "descripcion": "Consolidar un grupo de investigadores conformado por docentes y estudiantes, que promuevan la sistematización, generación y aplicación de conocimientos relacionados con el cuidado de enfermería y el concepto de gerencia del cuidado 1.- Cuidado a la persona sana y con enfermedad crónica 2.- Cuidado de enfermería a la mujer recién nacido infante y adolescente 3.- Entornos saludables y seguros 4.- Gerencia del Cuidado ética y bioética ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad libre seccional pereira Belmonte Avenida Las Américas Carrera 28 No. 96-102",
            "email": "elcyastudillo@gmail.com"
          },
          {
            "nombre": "Gestión Ambiental - CARDER COL0206537",
            "descripcion": "Fortalecer las capacidades técnicas, administrativas e investigativas en la gestión ambiental a través de la ejecución de programas y proyectos para contribuir al desarrollo sostenible en el Departamento de Risaralda.1.- Bienes y Servicios Ecosistémicos. 2.- Gestión Ambiental Sectorial (Biocomercio, reconversión de sistemas productivos y saneamiento ambiental) 3.- Gestión Integral del Recurso Hídrico. 4.- Planificación Ambiental, Ordenamiento Territorial y Gestión Ambiental del Riesgo de Desastres.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION AUTONOMA REGIONAL DE RISARALDA CARDERAv. de las Américas #46-40",
            "email": "mvelez@carder.gov.co"
          },
          {
            "nombre": "Gestión Ambiental Territorial -GAT- COL0006886",
            "descripcion": "Somos un equipo de investigación que genera conocimiento desde las ciencias ambientales para el desarrollo de procesos de innovación que contribuyan a la configuración social del territorio.1.- Economía para la Gestión Ambiental 2.- Gestión Ambiental Urbano-Regional y Ordenamiento Territorial 3.- Gestión del Riesgo y Conflictos Ambientales 4.- Hábitat Sustentable y Educación Ambiental 5.- Modelos Ambientales, Cambio Climático y Metabolismo Urbano",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "gat@utp.edu.co"
          },
          {
            "nombre": "Gestión de Sistemas Eléctricos, Electrónicos y Automáticos COL0056939",
            "descripcion": "Desarrollar metodologías, herramientas y algoritmos que impactan y cubren las diferentes etapas del ciclo de vida de activos, como son: Planeación, Diseño, Construcción, Instalación, Mantenimiento, Comisionado, Optimización y Disposición de activos eléctricos, electrónicos y automáticos.1.- Estudios y análisis sobre enseñanza, aprendizaje y evaluación de la formación para, y en, las ingenierías.2.- Aplicaciones en instrumentación industrial, control automático, control de calidad y diseño3.- Aplicaciones industriales, comerciales y agrícolas basadas en aprendizaje de máquina y fusión de datos4.- Gestión de sistemas electrónicos de potencia5.- Gestión de sistemas eléctricos6.- Planeación, Diseño, Construcción, Instalación, Mantenimiento, Comisionado, Optimización y Disposición de activos eléctricos, electrónicos y automáticos7.- Sistemas autónomos de mantenimiento, inspección, confiabilidad y control de calidad basados en técnicas no invasivas",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mau.hol@utp.edu.co"
          },
          {
            "nombre": "Gestión en Agroecosistemas Tropicales Andinos COL0006948",
            "descripcion": "Generar alternativas sostenibles para el manejo de sistemas de producción agropecuaria que mejoren la calidad de vida de los productores de la región contribuyendo con la adaptación y la mitigación al cambio climático. Promover la investigación en los campos de los Sistemas Agroforestales y en el desarrollo, estudio, Manejo e implementación de Prácticas de Conservación de Suelos como una estrategia resiliente a la variabilidad climática y al cambio climático. 1.- Conservación, extensión y educación ambiental con énfasis en flora2.- Diversidad de Animales Domésticos y Silvestres3.- Ecología e Indicadores de Calidad Agroecosistémica4.- Estrategias Para Soluciones Agroalimentarias y la Pobreza5.- Estrategias para la adaptación y mitigación al cambio climático6.- Gestión Ambiental Rural7.- Inventario, silvicultura y planificación de Bosques de Bambú8.- Sistemas Agroforestales",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "jupipe@utp.edu.co"
          },
          {
            "nombre": "Gestión en Cultura y Educación Ambiental COL0020393",
            "descripcion": "Desarrollar estudios sobre relaciones históricas y sociopolíticas entre naturaleza y cultura, interpretación-resolución de conflictos socioambientales, así como en el fortalecimiento de las organizaciones sociales para la gestión ambiental, mediante la aplicación de estrategias en comunicación y educación ambiental.1.- Diálogo de Saberes y Gestión Cultural Ambiental 2.- Ecología Histórica y Patrimonio cultural 3.- Educación y Comunicación Ambiental 4.- Estudios Socioculturales y Problemática Ambiental ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "cel@utp.edu.co"
          },
          {
            "nombre": "GIA - GRUPO DE INVESTIGACION EN INTELIGENCIA ARTIFICIAL COL0048169",
            "descripcion": "Fomentar la investigación en el área de la inteligencia artificial, alcanzar el estado del arte en las áreas de la IA, crear conocimientos nuevos relevantes, creación de tecnología fundamentada en la investigación básica en IA.1.- Currícula en ciencias de la computación e ingeniería informática 2.- Geoposicionamiento utilizando dispositivos móviles 3.- Ingeniería de Software 4.- Inteligencia artificial 5.- Representación del conocimiento 6.- Sociedad del conocimiento ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "gia@utp.edu.co"
          },
          {
            "nombre": "GICIVIL COL0058686",
            "descripcion": "Realizar estudios conducentes para el mejoramiento, desarrollo e innovación de la práctica de la Ingeniería Civil, en la ciudad de Pereira. 1.- Gestión del riesgo y desarrollo sostenible 2.- Suelos y estructuras 3.- Vías , Transporte y Movilidad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad libre seccional pereira Belmonte Avenida Las Américas Carrera 28 No. 96-102",
            "email": "alejandro.alzateb@unilibre.edu.co"
          },
          {
            "nombre": "GIEE grupo de investigación en estadística y epidemiología COL0006302 ",
            "descripcion": "Presentar resultados conducentes a prevenir o atacar posibles epidemias y otros riesgos a nivel físico de la población Pereirana, Risaraldense y regional. Difundir conocimientos y experiencias útiles para los profesionales y estudiosos de la matemática y estadística aplicadas. Presentar resultados en ponencias regionales e internacionales. Presentar alternativas de investigación sobre las aplicaciones de las ciencias básicas y médicas en las demás ciencias.1.- Biofísica 2.- Biomatemáticas 3.- Biomecánica 4.- Biotecnología y bioprocesos 5.- Ciencias de la computación y desarrollo de Software 6.- Estadística y epidemiologia ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA DEL AREA ANDINA Cl. 24 #8-55, Pereira",
            "email": "jgo7@yahoo.es"
          },
          {
            "nombre": "GIMAV - UTP (Grupo de Investigación en Materiales Avanzados) COL0055405",
            "descripcion": "Realizar un trabajo integral de generación, transferencia y aplicación de conocimientos relacionados con la ciencia e ingeniería de materiales. 1.- Corrosión. 2.- Diseño. 3.- Materiales (aleaciones ferrosas) y Biomateriales 4.- Polímeros, Cerámicos y Compuestos 5.- Soldadura y Recubrimientos. 6.- Tribología y Desgaste de Superficies",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "josetris@utp.edu.co"
          },
          {
            "nombre": "GIMPRO Mejoramiento Productivo Empresarial COL0006919",
            "descripcion": "Realizar proyectos de investigación que aporten al mejoramiento productivo, la calidad de los procesos y el nivel competitivo de las empresas y organizaciones de la región. 1.- Mejoramiento Productivo 2.- Sistemas de Gestión de la Calidad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "johandmunoz@utp.edu.co"
          },
          {
            "nombre": "GIROPS COL0026815",
            "descripcion": "Navegación de Robots Móviles en Ambientes Dinámicos, utilizando Técnicas Inteligentes de Navegación Basada en Comportamientos. 2. Diseñar Comportamientos Complejos básicos de Navegación en Ambientes dinámicos como: Seguir paredes, Seguir límites, Circundar o evitar Obstáculos, Encontrar Objetivo final, etc.1.- Control de Robots Manipuladores2.- Desarrollo de técnicas inteligentes para navegación en robótica móvil3.- Percepción Sensorial4.- Visión por Computador",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "girops@ohm.utp.edu.co"
          },
          {
            "nombre": "GL Ingenieros",
            "descripcion": "Empresa dedicada a la prestación de servicios de diseño y ejecución de montajes eléctricos, automatización de procesos, gestión energética, fabricación de tableros eléctricos y sistemas solares fotovoltaicos.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Avenida 30 de AgostoNo. 40 - 45",
            "telefono": "(606) 329 1500 Ext 101",
            "dominio": "https:www.glingenieros.com.co ",
            "email": "secretaria@glingenieros.com.co"
          },
          {
            "nombre": "Gobernación de Risaralda",
            "descripcion": "Gestión de recursos públicos, en el ámbito económico, social y de gestión ambiental de los 14 municipios. Para ello interactúa con la comunidad civil, institucional, organizada y de control a través de los procesos de Asesoría y Asistencia Técnica e Inspección - Vigilancia y Control siendo su prioridad la atención oportuna al ciudadano.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Sociedad",
            "direccion": "Cl. 19 #No 13-17",
            "telefono": 63398300,
            "dominio": "https:www.risaralda.gov.co ",
            "email": "sandra.maya@risaralda.gov.co"
          },
          {
            "nombre": "Gravitación y Teorías Unificadas COL0025246",
            "descripcion": "Afianzamiento del Grupo dentro de la Universidad Tecnológica de Pereira y en el contexto nacional. - Solución de los primeros problemas investigativos planteados. - Consolidación de los vínculos con grupos de investigación en el área a abordar, tanto a nivel nacional como internacional. 1.- Física Computacional y Teorías Unificadas 2.- Gravitación Clásica 3.- Gravitación Cuántica",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "jquiroga@utp.edu.co"
          },
          {
            "nombre": "GRICFAS (Grupo de Investigación en Contabilidad: Financiera, Ambiental y Social) COL0129385",
            "descripcion": "Grupo de investigación dedicado a las siguientes temáticas:1.- Aplicación de Modelos y Teorías Contables 2.- Gestión Empresarial y Desarrollo Sostenible ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-103",
            "email": "leidyj.hernandezr@unilibre.edu.com"
          },
          {
            "nombre": "Grupo de Biotecnología-Productos Naturales COL0007829",
            "descripcion": "Realizar investigación para la conservación y el fortalecimiento de los bio-recursos de importancia farmacológica y agroindustrial a través de la química orgánica de productos naturales y de procesos biotecnológicos.1.- Bioprospección de la Flora Regional 2.- Biotecnología Vegetal 3.- Hongos endofíticos de las plantas 4.- Metabolómica de plantas 5.- Productos Naturales 6.- Síntesis Orgánica",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "omosquer@utp.edu.co"
          },
          {
            "nombre": "Grupo de Ecuaciones Diferenciales y Aplicaciones (Gredya) COL0135954",
            "descripcion": "Estudiar la dinámica de modelos que surgen en forma natural de otras áreas de conocimiento, como Física, Química, Biología y Economía entre otras. En particular, estamos interesados en mostrar existencia y estabilidad de soluciones periódicas de problemas no lineales con singularidades en la variable dependiente. 1.- Matemática computacional 2.- Análisis Cualitativo de ecuaciones diferenciales 3.- Ecuaciones diferenciales con singularidades 4.- Educación y didáctica de la matemática 5.- Oscilaciones no lineales en modelos biológicos y físicos",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "alexguti@utp.edu.co"
          },
          {
            "nombre": "Grupo de Estudio del Recurso Hídrico COL0019777",
            "descripcion": "Desarrollar investigación en química analítica aplicada enfocada a la solución de problemas que afectan la calidad del recurso hídrico y a los sectores agroindustrial, salud entre otros; para mejorar las condiciones de vida de la sociedad a través de proyectos, trabajos y la transferencia y apropiación social del conocimiento.1.- Desarrollo de la Política Nacional para la Gestión Integral de los Residuos Peligrosos. 2.- Desarrollo de la Química analítica mediante la aplicación de técnicas cromatográficas para la evaluación de analitos en diferentes matrices, entre ellas: Aguas; Alimentos, suelos y otros. 3.- Desarrollo de metodologías analíticas para la microbiología ambiental e industrial. 4.- Desarrollo estratégico de los criterios de calidad analítica principalmente en la Validación y verificación de métodos y estimación de la incertidumbre para los ensayos de los laboratorios químicos 5.- Generación de propuestas integrales para la evaluación, el monitoreo y el seguimiento que tiendan al mejoramiento de la calidad del agua para consumo en comunidades urbanas y rurales. 6.- Implementación de técnicas analíticas para la evaluación de contaminantes Emergentes en el Medio Ambiente entre otras sustancias de interés ambiental y sanitario. 7.- Química de los Alimentos ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "camontoy@utp.edu.co"
          },
          {
            "nombre": "Grupo de Fenomenología y Teoría Crítica de la Sociedad COL0008432",
            "descripcion": "Dimensionar la investigación desde una perspectiva interdisciplinaria: - Convocar especialistas en fenomenología. - Preparar estudiantes de pregrado y postgrado en las líneas de fenomenología. - Intercambio con grupos académicos. 1.- Fenomenología 2.- Fenomenología y Cultura 3.- Fenomenología y sociedad (políticas públicas) 4.- Formación y enseñanza de la filosofía 5.- Hermenéutica 6.- Solipsismo y Relaciones de Intersubjetividad 7.- Teoría crítica de la sociedad 8.- fenomenología de la intersubjetividad y la comunicación",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "juansipaso@utp.edu.co"
          },
          {
            "nombre": "Grupo de Fisiología Celular y Aplicada COL0025649",
            "descripcion": "Promover el estudio y la investigación en la Fisiología Celular, tanto en forma general como en temas específicos de esta disciplina, para generar nuevo conocimiento que realice aportes significativos al desarrollo de esta área.1.- Efectos fisiológicos del arte 2.- Electrofisiología celular 3.- Fisiología aplicada 4.- Modelos electrofisiológicos computacionales 5.- Neurociencias 6.- Receptores hormonales ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jcsanchez@utp.edu.co"
          },
          {
            "nombre": "GRUPO DE INVESTIGACIÓN DE FARMACOEPIDEMIOLOGIA Y FARMACOVIGILANCIA COL0037256",
            "descripcion": "Desarrollar las líneas de investigación en Farmacoepidemiología, Farmacovigilancia y Farmacoeconomía para profundizar en el conocimiento del comportamiento de los medicamentos en poblaciones humanas colombianas.1.- Farmacoeconomía 2.- Farmacoepidemiología 3.- Farmacogeriatría 4.- Farmacología básica 5.- Farmacología clínica 6.- Farmacovigilancia ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "machado@utp.edu.co"
          },
          {
            "nombre": "Grupo de investigación en análisis de datos y sociología computacional - GIADSc COL0077968",
            "descripcion": "El objetivo general de este grupo será el de desarrollar metodologías, estrategias, planes, programas y proyectos basados en investigación, desarrollo e innovación (I+D+i) relacionados con el desarrollo de tecnologías y la aplicación de sistemas de información para el análisis de datos enfocados en la solución de problemas del contexto regional y nacional.1.- Análisis de datos 2.- Desarrollo sostenible 3.- Educación 4.- Innovación y gestión social 5.- Inteligencia y planificación sostenible 6.- Procesamiento de lenguaje natural 7.- Procesamiento de señales 8.- Sociología computacional ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jde@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Astronomía Alfa Orión COL0026609",
            "descripcion": "Crear un espacio que permita a la comunidad universitaria adelantar labores investigativas en Astronomía con el fin de posicionar a la Universidad Tecnológica de Pereira como una de las instituciones pioneras en el incipiente estudio de esta ciencia en el país. 1.- Apropiación Social de las Ciencias del Espacio 2.- Astrofísica Estelar 3.- Cuerpos Menores del Sistema Solar 4.- Radioastronomía",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "utpCarrera 27 #10-02 Álamos Pereira",
            "email": "equintero@utp.edu.co"
          },
          {
            "nombre": "Grupo de investigación en Ciencias Agropecuarias ICATURS COL0153291 ",
            "descripcion": "Incrementar las competencias y capacidades de investigación aplicada, desarrollo e innovación tecnológica del grupo de investigación. Identificar las necesidades de CTI para el desarrollo agroindustrial del sector Agropecuario. 1.- Desarrollo Rural Sostenible 2.- Gestión de recursos naturales y sostenibilidad ambiental 3.- Procesos agroindustriales, seguridad alimentaria y biotecnología 4.- Producción agrícola, agroecológica y pecuaria ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "SENA Carrera 8a No 26-79",
            "email": "gpcastano@sena.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Ciencias Quirúrgicas COL0024249",
            "descripcion": "Contribuir al desarrollo mediante la generación de conocimiento con aplicación a las artes y ciencias de la cirugía, en el marco del ejercicio de la especialidad. Estimular, promover y apoyar la educación, investigación y desarrollo en el arte y ciencia de la cirugía. Fomentar la investigación clínica en las áreas quirúrgicas, básica o tecnológica, con aplicación a las patologías de manejo de los cirujanos o relacionadas con el área quirúrgica.1.- Cirugía mínimamente invasiva 2.- Especialidades quirúrgicas y afines (psiquiatría de enlace) 3.- Línea cáncer 4.- Línea cirugía, educación e historia 5.- Línea infecciones quirúrgicas 6.- Línea trauma 7.- Línea vascular y trasplantes 8.- Nutrición ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "rocabral@utp.edu.co"
          },
          {
            "nombre": "GRUPO DE INVESTIGACION EN ECONOMIA Y TECNOLOGIA. GIECOTEC COL0055334",
            "descripcion": "Enfatizar en el estudio de las relaciones existentes entre el marco institucional existente en una región o dimensión territorial cualquiera y el dinamismo (procesos, contenido y forma) de las estructuras de relaciones establecidas entre los diferentes actores sociales de esa misma región o territorio.1.- Complejización del pensamiento 2.- Diagnóstico y Estrategias Tecno-Económicas para el crecimiento y el Desarrollo. 3.- Economía Institucional, Estructura de Relaciones y Generación de conocimiento e innovación. 4.- Economía y Política del Cambio Tecnológico y de la Innovación 5.- Internacionalización, cambio técnico y competitividad sectorial, regional y nacional 6.- Propiedad Intelectual y Desarrollo Tecnológico y Económico 7.- Relación Universidad - Medio, Educación y Desarrollo Económico ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "omarm@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Estudios Rurales contextualizados al Territorio COL0105909",
            "descripcion": "Realizar investigaciones contextualizadas a las realidades territoriales, relacionadas con fenómenos rurales, teniendo en cuenta los componentes económico, social, ambiental, político y cultural que afectan a los habitantes del campo, mediante la aplicación de diversas metodologías para el desarrollo rural y el fomento de la sostenibilidad1.- Estudios Rurales contextualizados al Territorio 2.- Sistemas Sostenibles de Producción Agrícola",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION UNIVERSITARIA SANTA ROSA DE CABAL UNISARCVereda el Jazmín kilómetro 4 Vía Santa Rosa de Cabal – Chinchiná",
            "email": "gloria.cardenas@unisarc.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Farmacogenética COL0009752",
            "descripcion": "Desarrollar la línea de investigación en farmacogenética. Desarrollar investigación en biología molecular, en el marco de un programa académico de doctorado. Prestar servicios de laboratorio clínico en estudios de genotipificación.1.- Farmacogenética 2.- Medicina Regenerativa ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "gloria.hincapie@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Filosofía Antigüa COL0052922",
            "descripcion": "Fortalecer a nivel general un área de trabajo no sólo al interior de la UTP sino en relación con otros grupos de investigación fuera de la Universidad ( Universidad Nacional abierta y a distancia y otras) en donde el espacio académico para hablar de los temas de la filosofía antigua (helénica, clásica y presocrática) sea la excusa para abordar diferentes tópicos concernientes a dicha filosofía tales como el lenguaje, la educación, y los problemas clásicos de dicha rama del pensamiento (el conocimiento, el ser, la ética y la política)1.- Educación y didáctica 2.- Filosofía del lenguaje 3.- Filosofía política 4.- Filosofía y Metafísica 5.- Filosofía y cultura 6.- Filosofía y estética 7.- Filosofía y traducción 8.- Filosofía y ética ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "semilleroantiguautp@gmail.com"
          },
          {
            "nombre": "Grupo de Investigación en Fotocatálisis y Estado Sólido (GIFES) COL0100037",
            "descripcion": "Realizar estudios de foto degradación de compuestos orgánicos tóxicos en medios acuosos por medio de fotocatalizadores usando luz solar. Sintetizar nuevos fotocatalizadores por distintos métodos para estado sólido. Caracterizar los nuevos materiales por medio de propiedades físicas. 1.- Caracterización de materiales 2.- Cristaloquímica y estructura molecular. 3.- Enseñanza y Aprendizaje de la Química 4.- Fotocatálisis 5.- Preparación de catalizadores 6.- Producción de hidrógeno 7.- Química del Estado Sólido 8.- Superficies Autolimpiantes y antimicrobianas 9.- Tratamiento de aguas residuales para descontaminación y desinfección ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "hvalencia@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Geometría y Algebra GIGA COL0069563",
            "descripcion": "Desarrollar investigación de frontera en la representación categórica de álgebras difusas. Encontrar diversas relaciones entre las álgebras multi-valuadas y estructuras del álgebra conmutativa. Desarrollar conocimiento de frontera en la geometría algebraica difusa. 1.- Algebra Conmutativa Difusa 2.- Geometría Algebraica 3.- Matemática Computacional 4.- Teoría de Categorías 5.- Teoría de Grafos 6.- Teoría de representación de álgebras",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "yapoveda@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Gestión Energética (GENERGÉTICA) COL0032581",
            "descripcion": "Desarrollar proyectos de investigación en las líneas propuestas por el grupo al interior de la Universidad Tecnológica de Pereira.1.- Calidad del Aire 2.- Combustibles y combustión. 3.- Dinámica de fluidos computacional 4.- Energías Renovables 5.- Gestión Energética y Ambiental 6.- Refrigeración y cadena de frío 7.- Vehículos, movilidad y transporte ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "juantiba@utp.edu.co"
          },
          {
            "nombre": "Grupo de investigación en infecciones emergentes y medicina tropical COL0200515",
            "descripcion": "Aportar soluciones innovadoras que den respuesta a las necesidades del entorno en la región del Eje Cafetero en el área biomédica, a través de la generación de proyectos de CTeI de alta calidad e impacto y la diversificación del ecosistema científico, con especial énfasis en la salud tropical y las infecciones emergentes.1.- Biotecnología y salud 2.- Comportamiento humano e infección 3.- Virología traslacional ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "INSTITUTO PARA LA INVESTIGACION EN CIENCIAS BIOMEDICAS SCI HELP S A S Cra 3 # 28-51 Colombia | Pereira Risaralda",
            "email": "scihelp.sas@gmail.com"
          },
          {
            "nombre": "Grupo de Investigación en Ingeniería Electrónica COL0164651",
            "descripcion": "El Grupo de Investigación de Ingeniería Electrónica de la Universidad Tecnológica de Pereira tiene como objetivo contribuir a la formación científica y tecnológica de los estudiantes, por medio de un espacio de la investigación formativa, donde se logre ejercer la crítica académica, la creatividad y la innovación, se llegue al descubrimiento de nuevos conocimientos y métodos de aprendizaje, se logre un afianzamiento de los aspectos de formación profesional y se despierten capacidades y aptitudes propias de un investigador.1.- Agricultura de Precisión2.- Sistemas Embebidos3.- Sistemas Expertos",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "afcalvo@utp.edu.co"
          },
          {
            "nombre": "GRUPO DE INVESTIGACIÓN EN MEDICINA INTERNA COL0113302",
            "descripcion": "Generar, transferir y aplicar conocimiento relacionado la salud del paciente adulto.1.- Dermatología2.- Hematología3.- Infectología4.- Patología de la glándula tiroides5.- Riesgo cardiovascular6.- Diabetes mellitus7.- Tumores neuroendocrinos",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "talvarez@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Microbiología y Biotecnología (MICROBIOTEC) COL0088049",
            "descripcion": "Integrar y consolidar un grupo de investigadores conformado por docentes y estudiantes, que promuevan la sistematización, generación y aplicación de conocimientos relacionados con la microbiología, biología molecular, biotecnología y la seguridad alimentaria. 1.- Aprendizaje, pedagogía y transferencia de conocimiento en ciencias básicas 2.- Desarrollo tecnológico y Biotecnología 3.- Microorganismos de interés 4.- Seguridad y soberanía alimentaria",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-102",
            "email": "adalucy.alvareza@unilibre.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Movilidad Humana COL0072961",
            "descripcion": "El grupo de investigación en movilidad humana es un recurso de Centro de Estudios en Movilidad Humana y Conflicto (CEMHCO), y tiene como énfasis la investigación de hechos migratorios, especialmente de tipo internacional relacionados con la región cafetera colombiana. Lo conforma un equipo multidisciplinario que hace posible diversos enfoques de las investigaciones, privilegiando el trabajo en red y la colaboración con pares e instituciones nacionales e internacionales.1.- Flujos y Políticas Migratorias 2.- Interculturalidad, Territorio y Migración 3.- Migración y Buen Vivir 4.- Migración y Demografía 5.- Movilidad Humana y Construcción de Paces 6.- Psicología y Construcción de Subjetividades ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unad Carrera 23 con Diagonal 25F Barrio Milán",
            "email": "maria.triana@unad.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Nutrición y Alimentación Animal COL0125591 ",
            "descripcion": "Generar alternativas de alimentación bajo los principios de sostenibilidad y preservación de los recursos medioambientales que garanticen un adecuado costo y nivel de producción, sin perjudicar la salud animal, ni la del hombre. 1.- Conservación de forrajes tropicales 2.- Mejoramiento de la calidad de productos pecuarios 3.- Pastos y forrajes en la alimentación animal 4.- Utilización de sub-productos agrícolas y pecuarios en la alimentación animal 5.- Valoración nutricional de Ingredientes y alimentos para animales ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION UNIVERSITARIA SANTA ROSA DE CABAL UNISARCVereda el Jazmín kilómetro 4 Vía Santa Rosa de Cabal – Chinchiná",
            "telefono": "=",
            "email": "gaston.castano@unisarc.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Pensamiento Matemático y Comunicación COL0113572",
            "descripcion": "Investigar sobre aspectos relacionados con el desarrollo de pensamiento matemático en diferentes ámbitos sociales y sobre problemáticas relacionadas con la comunicación entre los actores que determinan la dinámica del proceso educativo. 1.- Didáctica de la matemática mediada por TIC 2.- Etnomatemática 3.- Modelación matemática en el aula 4.- Teoría cognitiva de la Matemática 5.- Teoría etnocognitiva del conocimiento matemático",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "oscarf@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en reanimación, urgencias y simulación COL0140168",
            "descripcion": "Contribuir al desarrollo regional mediante la generación de conocimiento con aplicación en medicina de urgencia desde su prevención e identificación de factores de riesgo hasta la atención final pasando por la atención inicial, prehospitalaria y en reanimación cardiopulmonar.1.- AIRe Atención Integral Respiratoria 2.- Reanimación y Urgencias 3.- Simulación clínica y educación en salud ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "giovalinore@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Telecomunicaciones NYQUIST COL0055361",
            "descripcion": "Generar una base de conocimiento en el área de software, seguridad de la información, ciencias de datos y telecomunicaciones, que permita la apropiación y desarrollo de tecnologías de punta y adecuación de éstas para dar solución a las necesidades de la sociedad en el ámbito empresarial, educativo y de estado.1.- Accesibilidad 2.- Alineación organizacional de TI 3.- Análisis y Procesamiento de Señales en 1D y 2D: 4.- Ciencias de Datos 5.- Protocolos de comunicación modernos. 6.- Seguridad de la Información 7.- TICs y Educación ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "anamayi@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación en Turismo Sostenible COL0187629",
            "descripcion": "Fortalecer los procesos curriculares del Programa Administración del Turismo Sostenible, el cual está adscrito a la Facultad de Ciencias Ambientales de la Universidad Tecnológica de Pereira, satisfaciendo las necesidades y expectativas de sectores productivos y de servicios con énfasis en la sostenibilidad.1.- Turismo y Territorio 2.- Turismo y competitividad",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "gritus@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación Entre Ciencia e Ingeniería COL0068771",
            "descripcion": "Generar y servir de apoyo a proyectos de investigación de los estudiantes de pregrado.1.- Enseñanza de las matemáticas y la Ingeniería 2.- Ingeniería de Software 3.- Innovación y aplicación de los sistemas y las telecomunicaciones 4.- Inteligencia Artificial & Ciencia de datos 5.- Operaciones Industriales y de Servicios 6.- Redes, Telecomunicaciones e Internet 7.- Simulación y Modelamiento Matemático ",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Entidades de educación superior",
            "direccion": "UNIVERSIDAD CATOLICA DE PEREIRA CARRERA 21 49 95 AVENIDA DE LAS AMERICAS",
            "email": "monica.gomez@ucp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación Hospital Universitario San Jorge COL0170022",
            "descripcion": "Visibilizar la gestión del conocimiento en el área de las ciencias médicas y de la salud en el ámbito hospitalario que se desarrolla en la ESE Hospital Universitario San Jorge 1.- Enfermedades infecciosas 2.- Gerencia y Administración de la salud 3.- Servicios médico asistenciales de mediana y alta complejidad ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "EMPRESA SOCIAL DEL ESTADO HOSPITAL UNIVERSITARIO SAN JORGE Cra. 4 # 24-88, Pereira, Risaralda",
            "email": "investigacion@husj.gov.co"
          },
          {
            "nombre": "Grupo de investigación para la productividad y la competitividad en las organizaciones COL0027071",
            "descripcion": "Realizar investigaciones que permitan conocer el estado de la gestión tecnológica de la región del Eje Cafetero, como instrumento para el mejoramiento de la competitividad empresarial y regional. 1.- Administración y organizaciones2.- Capital Intelectual, innovación y emprendimiento3.- Competitividad y Productividad",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jasaca@utp.edu.co"
          },
          {
            "nombre": "Grupo de Investigación PENSER COL0213255",
            "descripcion": "Desarrollar análisis críticos sobre los contextos socioeconómicos, políticos, educativos y culturales y sus tendencias, que orienten la toma de decisiones institucionales1.- Andragogía holística 2.- Formación integral de niños y jóvenes 3.- Procesos educativos sistémicos",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION PENSER",
            "email": "info@penser.org"
          },
          {
            "nombre": "Grupo de Investigación sobre las Capacidades Tecnológicas de las Organizaciones (GICTO) COL0010548",
            "descripcion": "Desarrollar competencia investigativa, con suficiencia e independencia teórica, desde los desarrollos teóricos sistémicos que implican autopoiesis, para la observación e intervención de organizaciones, la comprensión de procesos de innovación, de longevidad, sustentabilidad y la emergencia de innovaciones.1.- Análisis de Capacidades Tecnológicas de la Universidad 2.- Análisis de las Capacidades Tecnológicas Territoriales 3.- Análisis de las Capacidades Tecnológicas del Sector Empresarial 4.- Análisis de los procesos de innovación en las organizaciones",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "galijamj@yahoo.es"
          },
          {
            "nombre": "Grupo de Investigación Social GIS COL0039179",
            "descripcion": "General Emprender procesos de investigación para la comprensión, análisis y el abordaje de los fenómenos psicosociales en el ámbito educativo, comunitario y rural. 1.- Ambientes de aprendizaje en la educación superior a distancia 2.- Desarrollo Rural Sostenible 3.- Intersubjetividades, contextos y desarrollo 4.- Psicología y construcción de subjetividades",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unad Carrera 23 con Diagonal 25F Barrio Milán",
            "email": "marlipale@yahoo.es"
          },
          {
            "nombre": "Grupo de Investigadores de Enfermería de Risaralda COL0043262",
            "descripcion": "Promover la Capacidad de indagación, búsqueda de información que permita favorecer la formación de docentes y estudiantes a través de aproximaciones críticas y permanentes a los problemas de conocimiento que atañen al cuidado profesional de enfermería en procura de mejores condiciones de salud y bienestar de individuos, familias, comunidades y entorno, en el marco del eje estratégico Areandino: Humanización de las profesiones.1.- Cuidado de enfermería a individuos, familias y comunidades2.- Innovación en enfermería",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA DEL AREA ANDINA Cl. 24 #8-55, Pereira, Risaralda",
            "email": "lbernal63@areandina.edu.co"
          },
          {
            "nombre": "Grupo GEMAS SAS",
            "descripcion": "Empresa prestadora de servicios profesionales en Gestión de la Calidad, Gestión de la Seguridad y Salud en el Trabajo, Gestión de la Seguridad Vial, Gestión Ambiental y demás Sistemas de Gestión",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 12B 11B - 58",
            "telefono": "57-60-6-344-4992",
            "email": "servicioalcliente@grupogemas.co"
          },
          {
            "nombre": "GRUPO INVESTIGACIÓN ENFERMEDADES INFECCIOSAS GRIENI COL0173481",
            "descripcion": "Identificar problemas de la región y del país a nivel de enfermedades infecciosas que requieran para su solución la aplicación de técnicas microbiológica y de Biología Molecular. 1.- Enfermedades infecciosas2.- Mecanismos de resistencia antimicrobiana",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jimo@utp.edu.co"
          },
          {
            "nombre": "Grupo Polifenoles COL0023116",
            "descripcion": "Contribuir a la formación académica e investigativa de los estudiantes de la escuela de química de la Universidad Tecnológica de Pereira. Formar profesionales con capacidad analítica e investigativa, que participen de manera activa en procesos y desarrollos de la industria química. 1.- Actividad biológica de productos naturales 2.- Aislamiento y elucidación estructural de compuestos de origen vegetal 3.- Bioinorgánica y química verde 4.- Biotransformación de compuestos de interés biológico 5.- Transformación de biomasa",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "lveloza@utp.edu.co"
          },
          {
            "nombre": "Grupo SiriusCOL0035995",
            "descripcion": "El Grupo de Investigación Sirius de Ingeniería de Sistemas y Computación tiene como objetivo fomentar los desarrollos en las áreas de la electrónica digital, las telecomunicaciones, las redes de computadoras y la arquitectura de computadores principalmente.1.- Análisis, Control y Estabilidad de Sistemas No Lineales 2.- Arquitectura de Computadores 3.- Bioinformática 4.- Ciencia de Datos 5.- Computación de Alto desempeño 6.- Computación Cuántica 7.- Computación Reconfigurable (RASC) 8.- Desarrollo de Software 9.- Diseño Digital 10.- Procesamiento Digital de Imágenes 11.- Sistemas Embebidos 12.- Sistemas Inteligentes de Transporte 13.- Sistemas de Distribución de Potencia ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "info@sirius.utp.edu.co"
          },
          {
            "nombre": "Hospital Universitario San Jorge de Pereira",
            "descripcion": "Empresa Social del Estado - Salud Pereira es una entidad del orden departamental de origen público, con prestación de mediana y alta complejidad",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 4 # 24-88",
            "telefono": "57-60-6-320-6745",
            "dominio": "https:husj.gov.co ",
            "email": "info@husj.gov.co"
          },
          {
            "nombre": "ICA seccional Risaralda",
            "descripcion": "Extensión agropecuaria, innovación, prevención de riesgos sanitarios y fitosanitarios, protección y sanidad animal y vegetal, bienestar de los animales y la inocuidad en la producción primaria.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 9 #7-282, La Badea",
            "telefono": "3300206 - 33005244201",
            "dominio": "https:www.ica.gov.co el-ica directorio risaralda.aspx",
            "email": "gerencia.risaralda@ica.gov.co"
          },
          {
            "nombre": "Incubar Eje Cafetero",
            "descripcion": "Actúa como catalizador para empresas innovadoras de base tecnológica, facilitando la colaboración entre centros de conocimiento, estado, empresas y comunidad",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 23C 62-72 Ed. Pranha",
            "telefono": 3202064790,
            "dominio": "https:incubar.org ",
            "email": "info@incubar.org"
          },
          {
            "nombre": "INDICIOS: Educación, Arte y Cultura Visual COL0189104",
            "descripcion": "General: Profundizar en la educación y el arte, como campos de conocimiento interdisciplinario, aplicados para la transformación pedagógica con proyectos de intervención en ámbitos educativos, sociales y culturales. 1.- Historia y Crítica del Arte en América Latina 2.- Mediaciones Tecnológicas en la Educación y el Arte 3.- Pedagogía y Didáctica del Arte en el Acto Educativo ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "grupoindicios@utp.edu.co"
          },
          {
            "nombre": "INFECCIÓN E INMUNIDAD COL0056199",
            "descripcion": "Generar conocimiento a través de actividades de investigación, docencia y extensión, orientados al estudio de patologías infecciosas y o con base inmunológica prevalentes en la ecorregión cafetera.1.- Biomateriales 2.- Biotecnología y Biología Molecular 3.- Enfermedades Infecciosas 4.- Inmunología 5.- Inmunomodulación por productos naturales 6.- Medicina Regenerativa ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jcsepulv@utp.edu.co"
          },
          {
            "nombre": "Informática COL0026913",
            "descripcion": "1) Estudiar, analizar y profundizar en nuevas tendencias técnicas, tecnológicas y metodológicas que marquen la dirección hacia la cual avanza la Informática tanto en la región, en nuestro país y en el mundo 2) Conocer, difundir, mejorar y apropiar nuevas metodologías de aprendizaje y enseñanza en diferentes campos de la Ingeniería1.- Análisis de nuevos paradigmas de Programación 2.- Humanización de la Ingeniería 3.- Metodologías de Aprendizaje Activo 4.- Teorías y Modelos de Aprendizaje en el Cerebro ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Centros de desarrollo tecnológico",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "omtrejos@utp.edu.co"
          },
          {
            "nombre": "Ingeniar Inoxidables",
            "descripcion": "Fabricación de equipos en acero inoxidable para industrias de alimentos, oil & gas, textiles, automotriz, industrias de mantenimiento y agroindustria. También elaboración de mobiliario en acero inoxidable para el sector HORECA (Hoteles, Restaurantes y Cafeterías), equipos para clínicas, hospitales, veterinarias y funerarias; igualmente al sector de la construcción, centros comerciales, conjuntos residenciales, firmas de arquitectos e ingenieros, entre otros.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Entidad privadas",
            "direccion": "Cra.12 N°28–37",
            "telefono": "(606) 329 5597",
            "dominio": "https:www.ingeniarinoxidables.com ",
            "email": "geradmin@ingeniarinoxidables.com"
          },
          {
            "nombre": "Ingeniería Biomédica y Ciencias Forenses BIOIF COL0188259",
            "descripcion": "Establecer un espacio interdisciplinario para contribuir a la academia con proyectos de investigación desde la ingeniería física a la bioingeniería y a las ciencias forenses, a través del desarrollo constante de producción académica y formación de talento humano.1.- Bioingeniería y tratamiento digital de señales 2.- Física de Materiales y Biomateriales 3.- Física forense ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jtrujillo@utp.edu.co"
          },
          {
            "nombre": "Ingenio Risaralda",
            "descripcion": "Empresa dedicada a la fabricación de azúcar: moscabado, blanco corriente , blanco especial , refinado y micro pulverizado.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 7 Nro. 19 48 Piso 8 Edificio Banco Popular",
            "telefono": "57-60-6-335-2475",
            "dominio": "https:www.ingeniorisaralda.com es ",
            "email": "comunicaciones@ingeniorisaralda.com"
          },
          {
            "nombre": "Iniciativa Adau - Risaralda",
            "descripcion": "Tiene como objetivo fortalecer la competitividad del subsector agroindustrial de la mora en el departamento, mediante acciones estratégicas y políticas públicas.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Cámara de Comercio de Pereira",
            "telefono": 3128875413,
            "dominio": "https:redclustercolombia.gov.co initiatives_f 8 show-initiatives",
            "email": "juangrisales@agregandovalor.org"
          },
          {
            "nombre": "Innpulsa",
            "descripcion": "Promueve el crecimiento empresarial, el emprendimiento y la economía popular mediante la ejecución de la política de reindustrialización nacional.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Calle 28 No. 13 A 15 Piso 37",
            "telefono": "01 8000 180098",
            "dominio": "https:www.innpulsacolombia.com taxonomy term 141",
            "email": "info@innpulsacolombia.com"
          },
          {
            "nombre": "Instituto Cardiovascular de Risaralda",
            "descripcion": "IPS especializada en la Prevención y Manejo Riesgo Cardiovascular tanto en niños como en adultos, con servicios de Cardiología, Nefrología y Medicina Interna",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Avenida Circunvalar Nro. 3 01 Clinica Comfamiliar",
            "telefono": "57-60-6-327-1897",
            "dominio": "https:www.inscardiovascular.com ",
            "email": "info@inscardiovascular.com"
          },
          {
            "nombre": "Instituto de Epilepsia y Parkinson del Eje Cafetero S.A.",
            "descripcion": "Empresa dedicada a la prestación de servicios integrales, tratamientos personalizado y uso de métodos diagnósticos terapéuticos avanzados para patologías neurológicas.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 12 Nro 18 - 24 Torre 3 Piso 3 Megacentro Pinares",
            "telefono": "57-60-6-324-3681",
            "email": "gerencia@neurocentro.co"
          },
          {
            "nombre": "Instituto del Sistema Nervioso de Risaralda",
            "descripcion": "Empresa dedicada a la prestación de servicios integrales de promoción, prevención, diagnóstico, tratamiento, rehabilitación e inclusión social, con el fin de contribuir al bienestar del individuo, la familia y la comunidad. Participa en la formación de talento humano como escenario de práctica especializado y en la generación de conocimiento en el área de salud mental.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 11 Nro.23-31 Barrio Alamos",
            "telefono": "57-60-6-348-9018",
            "dominio": "https:institutosistemanervioso.com ",
            "email": "secretaria@institutosistemanervioso.com"
          },
          {
            "nombre": "Integra S.A.",
            "descripcion": "Servicio de transporte de cobertura integral del Sistema Megabús con 37 vehículos articulados y 42 alimentadores con exclusividad en la alimentación de la cuenca de Dosquebradas y cobertura parcial en alimentación de la cuenca de Cuba, Risaralda.",
            "tipo": "Otros",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 13 No. 15 -53 Alpes",
            "telefono": 6063419430,
            "dominio": "https:www.facebook.com integratransporte ?locale=es_LA",
            "email": "rbolanos@integra.com.co"
          },
          {
            "nombre": "Investigación de conceptos emergentes en energía eléctrica - ICE3 COL0053643",
            "descripcion": "Desarrollar investigaciones en el área de energía eléctrica, relacionados con problemas emergentes del sector. -Aplicar los resultados de las investigaciones en problemas reales tanto de la industria como de los prestadores del servicio de energía eléctrica1.- Análisis y modelado de fuentes, cargas y elementos de almacenamiento de energía eléctrica 2.- Aplicación de técnicas de aprendizaje de máquina, en problemas relacionados con la energía 3.- Calidad del servicio de energía eléctrica 4.- Estabilidad de sistemas de potencia 5.- Localización de fallas en sistemas de potencia 6.- Protección de sistemas eléctricos 7.- Sistemas eléctricos de potencia ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jjmora@utp.edu.co"
          },
          {
            "nombre": "Investigación en educación y pedagogía COL0012749",
            "descripcion": "1. Producir saber pedagógico sobre los aspectos educativos y pedagógicos en textos escolares y sus prácticas, metacognición, educación, lenguaje y aprendizaje para contribuir al mejoramiento, calidad y excelencia en los procesos de formación de profesionales de la educación. 2. Hacer investigación en pedagogía y educación con estándares científicos nacionales e internacionales en el marco de la conformación de comunidades científicas.1.- Cognición, didáctica y educación. 2.- Lenguaje, didáctica y educación 3.- Pedagogía, saberes y educación 4.- Textos escolares: saberes escolares, contenido, discurso e iconografía y usos",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mvictoria@utp.edu.co"
          },
          {
            "nombre": "Investigación en propiedades magnéticas y magneto-ópticas de nuevos materiales COL0025291",
            "descripcion": "Investigación en propiedades magneto-ópticas y magnéticas de nuevos materiales en la UTP.1.- Enseñanza de la Física Experimental 2.- Estudio de las propiedades físicas de materiales en aplicaciones con energías renovables y desarrollo, simulación y evaluación de sistemas térmicos con energía solar 3.- Instrumentación de equipos 4.- Magnetismo y magneto-óptica de nuevos materiales 5.- Magnetobiología 6.- Metalurgia de Polvos 7.- Radiación Electromagnética Aplicada",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "bcruz@utp.edu.co"
          },
          {
            "nombre": "Investigación y Desarrollo en Cultura de la Salud COL0020357",
            "descripcion": "Generar conocimiento en torno a los estilos de vida y su relación con el proceso salud - enfermedad, para implementar estrategias de promoción de la salud y de prevención, atención y rehabilitación de las enfermedades, tendientes a mejorar la calidad de vida de las personas y comunidades.1.- Actividad Física y Salud 2.- Bioética, comunicación y Cultura 3.- Entrenamiento de la actividad físico deportiva 4.- Gerencia y Derecho Deportivo 5.- Infancia y Familia. 6.- Ludoteca para la Salud Mental y Convivencia 7.- Motricidad, Discapacidad y Rehabilitación 8.- Prevención del ahogamiento, socorro y rescate acuático 9.- Recreación Psicoterapéutica 10.- Recreación y Desarrollo Humano 11.- Salud Mental ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jocagirt@utp.edu.co"
          },
          {
            "nombre": "Jardín Botánico UTP",
            "descripcion": "ofrece servicios como: recorridos guiados, vivero, alquiler de espacios, centros de documentación, reservas, talleres y zonas de comidas.",
            "tipo": "Promoción y divulgación científica",
            "tipoCliente": "Centros de ciencia",
            "direccion": "Universidad Tecnología de Pereira. Vereda la julita",
            "telefono": "(6) 3212523",
            "dominio": "https:es-la.facebook.com jardinbotanicoutp ",
            "email": "jardinbotanico@utp.edu.co"
          },
          {
            "nombre": "La Federación de Organizaciones Ambientales de Risaralda (FONGAR)",
            "descripcion": "Consolidar el sector ambiental en el marco de su propia autonomía, de manera que posibilite su participación en la construcción de políticas, planes, programas y proyectos ambientales, permitiendo consolidar un espacio de vital importancia para las ONG’s y las comunidades",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "ONG",
            "direccion": "Centro Comercial Fiducentro Local CD11",
            "telefono": 3330893,
            "dominio": "http:www.fongar.8m.net ",
            "email": "email@emailaddress.com"
          },
          {
            "nombre": "Laboratorio de investigación en desarrollo eléctrico y electrónico - LIDER COL0025925",
            "descripcion": "Fomentar la investigación básica, experimental y aplicada en un ambiente crítico y analítico, que permita generar nuevo conocimiento y fortalecer la formación académica alrededor de las líneas de investigación del programa de tecnología eléctrica de la Universidad Tecnológica de Pereira.1.- Control Algebraico 2.- Diseño Electrónico 3.- Monitoreo y control de sistemas eléctricos de potencia 4.- Planeamiento de sistemas eléctricos de potencia 5.- Procesamiento Digital de Señales 6.- Telecomunicaciones",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jr@utp.edu.co"
          },
          {
            "nombre": "LENGUAJE, LITERATURA Y POLITICA: Estudios transversales - COL0068889",
            "descripcion": "1. Estudiar las relaciones de poder como fenómeno comunicativo, cultural y en particular, lingüístico. 2. Adelantar investigaciones que contribuyan a fomentar determinados valores de interés social y político a través de la literatura. 3. Explorar las posibilidades abiertas por las narrativas contemporáneas y sus implicaciones a nivel político, social y cultural.1.- Giro Lingüístico: Implicaciones pedagógicas 2.- Literatura, Política y Sociedad 3.- Narrativas Contemporáneas",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "vican@utp.edu.co"
          },
          {
            "nombre": "L'H COL0056387",
            "descripcion": "Indagar y producir conocimiento de primera mano sobre el área de las artes plásticas y visuales que proponga nuevas vías de acercamiento y estudio de los fenómenos del arte contemporáneo y del mundo del arte, mediante una serie de proyectos artísticos y académicos en los cuales participen artistas, gestores culturales, estudiantes, profesores y personas interesadas en el arte, con el fin de profundizar en cuestionamientos teóricos y prácticos en materializaciones plásticas en diversas técnicas y laboratorios, procesos de investigación-creación y conceptos relacionados al arte de hoy y sus manifestaciones, teniendo en cuenta que en el país existen pocos estudios y desarrollos en el campo de las artes contemporáneas, siendo una urgente prioridad de investigación de acuerdo al creciente interés por la materia y la injerencia del arte de hoy en los procesos de construcción socio cultural y artístico de nuestra comunidad.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "salamanca@utp.edu.co"
          },
          {
            "nombre": "Liga Contra El Cáncer Risaralda",
            "descripcion": "Institución sin ánimo de lucro orientada a la educación para el diagnóstico temprano y tratamiento oportuno e integral del cáncer y otras enfermedades.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Carrera 4 # 23-55",
            "telefono": "57 606 3341513",
            "dominio": "https:www.ligacancerrisaralda.com.co ",
            "email": "contacto@ligacancerrisaralda.com"
          },
          {
            "nombre": "Literatura Latinoamericana y Enseñanza de la Literatura COL0063639",
            "descripcion": "Generar un espacio para la investigación literaria en torno a autores, obras y procesos de la literatura colombiana y latinoamericana, para la elaboración de proyectos de grado especializados. Así mismo, la participación de profesores y estudiantes en eventos nacionales e internacionales para socializar los resultados.1.- Estrategias narrativas (transmedia) 2.- Evaluación de la lectura, la escritura y la oralidad 3.- Ficción e historia 4.- Literatura Latinoamericana 5.- Narraciones excéntricas (literatura afroamericana, amerindia, regionales, entre otras).",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "literatura@utp.edu.co"
          },
          {
            "nombre": "LOGISTICA: ESTRATEGIA DE LA CADENA DE SUMINISTRO COL0061304",
            "descripcion": "Fortalecer las líneas de investigación como una estrategia para ayudar resolver los problemas logísticos en las organizaciones locales, regionales, departamentales y nacionales. 1.- Aplicaciones de modelos para mejorar la productividad y competitividad en la cadena de suministro2.- Gestión del Conocimiento e Innovación3.- Importancia de la logística inversa en el rescate del medio ambiente4.- Optimización logística5.- Sincronización de la cadena de suministro",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "ppbs@utp.edu.co"
          },
          {
            "nombre": "Magnetron",
            "descripcion": "Empresa dedicada a producir y comercializar transformadores y equipos para el sector energético",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Entidades públicas",
            "direccion": "Kilometro 9 Via Pereira Cartago",
            "telefono": "57-60-6-315-7100",
            "dominio": "https:www.magnetron.com.co es ",
            "email": "info@magnetron.com.co"
          },
          {
            "nombre": "Materiales de Ingeniería (GIMI) COL0033542",
            "descripcion": "Incentivar la investigación formativa en estudiantes de todos los niveles académicos y profesores de la Facultad de Tecnología de la Universidad Tecnológica de Pereira.1.- Materiales metálicos 2.- Polímeros 3.- Soldadura 4.- Tribo-corrosión 5.- Tribología ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "dhmesa@utp.edu.co"
          },
          {
            "nombre": "MECABOT COL0102111",
            "descripcion": "Promover el desarrollo de los procesos productivos y de mejoramiento del nivel de vida de la sociedad mediante el desarrollo de proyectos de investigación desde la mecatrónica y la creación y transmisión del conocimiento adquirido en su desarrollo.1.- Aeronáutica2.- Automatización industrial3.- Diseño mecatrónico de máquinas4.- Energías Limpias5.- Enseñanza de la mecatrónica por ciclos propedéuticos6.- Instrumentación y Control7.- Robótica8.- Sistemas y Señales",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "mecabot@utp.edu.co"
          },
          {
            "nombre": "Medicina crítica y Cuidado intensivo COL0182954",
            "descripcion": "Adquirir los conocimientos científicos, teóricos - prácticos y las habilidades investigativas con conciencia y ánimo de servicio social, capaz de asumir una actitud crítica ante cada situación, analizarla con el profundo conocimiento de la realidad del país. Con el propósito de formular y desarrollar ideas investigativas que atiendan problemáticas alrededor de situaciones críticas de salud pacientes, con sentido humano y utilización eficiente de recursos. 1.- Educación médica2.- Imágenes diagnósticas y ultrasonido3.- Reanimación avanzada4.- Sepsis - infecciones – shock5.- Ventilación mecánica",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jotaefe77@utp.edu.co"
          },
          {
            "nombre": "MENTA Refrescando la educación con TIC e innovación. COL0001459",
            "descripcion": "1. Realizar investigaciones que permitan contribuir a dar respuestas oportunas al sector educativo y empresarial en el vertiginoso cambio que ofrece las tecnologías de las información y comunicaciones. Teniendo como protagonistas las redes de alta velocidad. 2. Fortalecer al Centro de Recursos educativos e Informáticos de la Universidad. 1.- infraestructura técnica y tecnológica 2.- Diseño Gráfico y Web y su influencia en los procesos educativos 3.- Formación en tics para docentes educación preescolar, básica y media y superior; 4.- Productividad, Competitividad y TICS 5.- Redes de alta velocidad y sus efectos en la Educación",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jorojas@utp.edu.co"
          },
          {
            "nombre": "MEOCRICOL0173632",
            "descripcion": "Crear nuevos conocimientos en las principales patologías que generan morbilidad y mortalidad materna. 2. Generar lazos de investigación a nivel nacional e internacional, principalmente a nivel latinoamericano, en donde se realicen proyectos colaborativos. 3. Crear investigación de calidad en el área de ginecología- obstetricia1.- Educación medica2.- Educación para la salud3.- Preeclampsia4.- Sepsis en el embarazo",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "meocriutp@gmail.com"
          },
          {
            "nombre": "Mercado Agroecológico UTP",
            "descripcion": "Comercialización y divulgación, para que productores y consumidores de alimentos agroecológicos intercambien saberes, experiencias, semillas y alimentos.",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Unversidad tecnológica de Pereira Centro de Gestión Ambiental Edificio 13B Oficina 13B-201",
            "telefono": "(606) 313 7300",
            "dominio": "https:mercado-agroecologico.utp.edu.co ",
            "email": "mercadoagroecológico@utp.edu.co"
          },
          {
            "nombre": "Merkator COL0149566",
            "descripcion": "Desarrollar investigación desde un enfoque multidisciplinario enfocada al fortalecimiento de los sectores productivos de la región en los que se enmarcan los programas de formación que se imparten en el Centro de Comercio y Servicios de la Regional Risaralda del SENA. Fortalecer las competencias investigativas en los aprendices, instructores y administrativos que participen en los proyectos de investigación. 1.- Ciencias aplicadas a la Industria 2.- Comercio y ventas 3.- Cultura, turismo y gastronomía 4.- Educación y formación profesional integral 5.- Gestión administrativa y financiera 6.- Logística, transporte y procesos industriales 7.- Salud, bienestar y actividad física ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "SENA, Cra. 8a. No. 26 - 79 Pereira",
            "email": "merkator@sena.edu.co"
          },
          {
            "nombre": "Metalgas S.a.",
            "descripcion": "Empresa metalmecánica dedicada al diseño y fabricación de recipientes metálicos para presión, mobiliario metálico y piezas de precisión a partir de laminas planas de acuerdo a especificaciones brindadas por el cliente.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Cl 79A #16-168, La Romelia",
            "telefono": 6063283748,
            "dominio": "https:www.facebook.com metalgas ",
            "email": "asistentecomercial@metalgas.com.co"
          },
          {
            "nombre": "Metgroup SAS",
            "descripcion": "Empresa dedicada al desarrollo de productos electrónicos y metalmecánicos integrando tecnologías para el sector transporte; transformaciones a vans; unidades especiales; fabricación de sillas y servicios para el sector del transporte masivo, colectivo, especial e intermunicipal.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Km 1.4 vía Cerritos",
            "telefono": "(+57) (6) 320 70 09",
            "dominio": "https:www.metgroupsas.com ",
            "email": "coordinadorsac@metgroupsas.com"
          },
          {
            "nombre": "Metrología Bioeléctrica COL0134269",
            "descripcion": "Ampliar primordialmente el alcance para la calibración de variables eléctricas y Biomédicas que demande la industria y el sector salud, y que el laboratorio pueda implementar con la adquisición de equipos nuevos y de los ya existentes.1.- Medición de radiaciones ionizantes 2.- Metrología Biomédica 3.- Metrología Industrial",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "ginvestigacion.metrologia@utp.edu.co"
          },
          {
            "nombre": "Ministerio de Comercio, Industria y Turismo",
            "descripcion": "Apoyar la actividad empresarial, productora de bienes, servicios y tecnología, así como la gestión turística de las diferentes regiones",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "email": "amadrid@mincit.gov.co"
          },
          {
            "nombre": "Museo de Arte de Pereira",
            "descripcion": "Tiene como objeto social el fomento y desarrollo de la cultura en todas sus manifestaciones, especialmente en el área de las artes plásticas, a través del Museo de Arte, como una institución permanente sin fines lucrativos, al servicio de la sociedad y de su progreso, abierta al público.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Sociedad",
            "direccion": "Avenida Las Américas # 19 – 88",
            "telefono": "(6) 3172828",
            "dominio": "https:museoartepereira.co ",
            "email": "museoartepereira@gmail.com"
          },
          {
            "nombre": "Música y comunidad COL0030531",
            "descripcion": "Plantear nuevas propuestas pedagógico musicales para la comunidad. Activar en la población regional y nacional el sentido de pertenencia por los valores culturales. Irradiar la música académica y tradicional en la comunidad Risaraldense. 1.- Arreglo, adaptación, orquestación y composición desde la dimensión creativa y o investigativa teórico-musical 2.- Estudios Musicales y Culturales 3.- Géneros, estilos y tendencias del desarrollo musical en contextos multiculturales a partir del estudio teórico-musical disciplinar e interdisciplinar 4.- La cultura musical académica de Colombia de los siglos XX y XXI desde una aproximación teórica musical 5.- Pedagogía musical 6.- Problemas teórico-musicales multidisciplinares de la herencia sonora de las tradiciones regionales, nacionales y o internacionales ",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "viktoria@utp.edu.co"
          },
          {
            "nombre": "Nodo de Innovación Social COL0189131",
            "descripcion": "Generar nuevo conocimiento, apropiación social del conocimiento, desarrollo tecnológico e innovación, a través del desarrollo de investigación aplicada y experimental en innovación social, de carácter multicapas, interinstitucional e interdisciplinaria, para generar valor y transformación social en las regiones de aprendizaje de la Universidad Cooperativa de Colombia.1.- Contabilidad Gestión e Innovación 2.- Control y Aseguramiento 3.- Derecho Humanos, Justicia Transicional Y Posconflicto 4.- Educación Social e Intervención Psicosocial 5.- El Poder Judicial y la Justicia 6.- Género, Territorio y Multiculturalidad 7.- Salud y Sociedad",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Cooperativa de Colombia, Dirección: La Julita, vía, Pereira, Risaralda",
            "email": "sergio.barbosag@campusucc.edu.co"
          },
          {
            "nombre": "Normarh S.A.S",
            "descripcion": "Empresa dedicada a diseñar, fabricar, y reparar moldes, y a generar productos mediante el proceso de inyección de materiales plásticos",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Avenida 30 de Agosto Nro. 37 65",
            "telefono": "57-60-6-336-3365",
            "dominio": "https:normarh.com ",
            "email": "gerencia@normarh.com"
          },
          {
            "nombre": "OBELIX - Ingeniería de Software COL0096069",
            "descripcion": "Determinar las necesidades y oportunidades de investigación del sector productivo de la región y desarrollar proyectos de investigación que conduzcan a la solución de las necesidades detectadas. 1.- Automatización y Control2.- Bioinformática3.- Ciencias de la computación4.- Ingeniería de Software5.- Robótica y Aplicaciones6.- Seguridad Informática7.- Soluciones Integrales de Comunicaciones",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad libre seccional pereira Belmonte Avenida Las Américas Carrera 28 No. 96-102",
            "email": "rgaviria@unilibrepereira.edu.co"
          },
          // {
          //   "nombre": "OLEOQUIMICA COL0017379 ",
          //   "descripcion": "Contribuir al desarrollo económico, social y científico de la región cafetera a través del estudio de los recursos naturales disponibles, en los sectores agroindustriales más promisorios, con propuestas para su aprovechamiento integral o desarrollo de nuevos productos que permitan su sostenibilidad. 1.- Aprovechamiento de productos y subproductos de la sericultura 2.- Caracterización de aceites y oleorresinas de diferentes fuentes vegetales 3.- Desarrollo de Productos Tecnológicos 4.- Estudio del impacto de pesticidas y contaminantes emergentes 5.- Estudio integral de frutales promisorios de la región cafetera. 6.-Estudio integral de plantas aromáticas y medicinales de la región cafetera 7.- Transformación de aceites de origen natural",
          //   "tipo": "Servicios tecnológicos",
          //   "tipoCliente": "Empresas",
          //   "direccion": "utpCarrera 27 #10-02 Álamos Pereira",
          //   "email": "juancorrales@utp.edu.co"
          // },
          {
            "nombre": "Oncólogos del Occidente S.A. COL0101319",
            "descripcion": "Generar, transferir y aplicar conocimiento relacionado con la atención integral del cáncer .1.- Acompañamiento sicosocial del paciente con cáncer 2.- Enfermedades infecciosas 3.- Epidemiologia del Cáncer 4.- Neumología 5.- Promoción de la salud y prevención del cáncer 6.- Rehabilitación del paciente con cáncer 7.- Sobrevida de pacientes con cáncer 8.- Tratamiento integral del cáncer ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "ONCOLOGOS DEL OCCIDENTE S A | FUNDACION ONCOLOGOS DEL OCCIDENTE Cra. 13 #No 1-46, Pereira, Risaralda",
            "email": "plondono@oncologosdeloccidente.com"
          },
          {
            "nombre": "Paideia COL0026833",
            "descripcion": "Consolidar una línea de reflexión en sociedad, cultura y currículo, a través del fortalecimiento de las competencias investigativas en el campo socio-humanístico de los diferentes integrantes del equipo. 2. Contribuir al debate científico y académico en torno a una conceptualización de colonial de las ciencias sociales1.- Humanismo Digital 2.- Procesos Biopsicosociales 3.- Sociedad, Cultura y Educación",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Areandina Cl. 24 #8-55, Pereira, Risaralda",
            "email": "lvillabona@areandina.edu.co"
          },
          {
            "nombre": "Parque Soft Risaralda",
            "descripcion": "ParqueSoft, líder en soluciones tecnológicas, impulsa el desarrollo e innovación en diversos sectores industriales. Reconocido internacionalmente por su excelencia",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 31 # 15 -87 CDV Barrio San Luis",
            "telefono": "(57) 314 8909913",
            "dominio": "https:parquesoftrisaralda.com ",
            "email": "info@parquesoftrisaralda.com"
          },
          {
            "nombre": "Parque temático de flora y fauna de Pereira S.A.S. “UKUMARÍ”",
            "descripcion": "Ukumarí enfatiza el compromiso social regional, educando sobre el medio ambiente, reciclaje y promoviendo la adopción y esterilización.",
            "tipo": "Comercialización de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Km. 14 Via Pereira - Cerritos Entrada Por Estacion Santa Barbara",
            "telefono": "57-60-6-315-3848",
            "dominio": "https:ukumari.org ",
            "email": "servicioalcliente@ukumari.co"
          },
          {
            "nombre": "Planeamiento en Sistemas Eléctricos COL0014707",
            "descripcion": "Mejorar los modelos matemáticos que representan los sistemas eléctricos en los diferentes problemas. - Mejorar las metodologías matemáticas de solución existentes para estos problemas, así como explorar nuevas metodologías. 1.- Armónicos en sistemas de energía eléctrica 2.- Confiabilidad de sistemas de energía eléctrica 3.- Control y estabilidad de sistemas eléctricos 4.- Energías renovables y Smart grids 5.- Mercados de energía eléctrica 6.- Planeamiento de sistemas de transmisión en mercados de energía eléctrica 7.- Planeamiento y operación de sistemas de distribución 8.- Protecciones de sistemas eléctricos 9.- Transporte ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "ragr@utp.edu.co"
          },
          {
            "nombre": "Planetario UTP",
            "descripcion": "El Planetario UTP ofrece servicios de divulgación científica en ciencias naturales para instituciones educativas, empresas y fundaciones. Sus programas educativos promueven el interés y la comprensión en campos como la astronomía, la física y la biología, a través de visitas guiadas y talleres interactivos.",
            "tipo": "Promoción y divulgación científica",
            "tipoCliente": "Centros o institutos de innovación",
            "direccion": "Carrera 27 #10-02 Barrio Álamos",
            "telefono": "(606) 313 7431",
            "dominio": "https:www2.utp.edu.co planetario ",
            "email": "yoselin-lopez@utp.edu.co"
          },
          {
            "nombre": "Plasma, Láser y Aplicaciones COL0026029",
            "descripcion": "1.- Sintetizar nanoestructuras con el método de Ablación Láser, 2.- Sintetizar Películas delgadas y multicapas, 3.- Caracterización de las muestras crecidas, mediante diferentes técnicas de caracterización. 1.- Deposición de Películas delgadas por Ablación Láser 2.- Física de Plasmas y Aplicaciones 3.- Producción de Plasmas por Láser.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "hriascos@utp.edu.co"
          },
          {
            "nombre": "Policía metropolitana de Pereira",
            "descripcion": "Brindar servicios de seguridad, vigilancia y prevención de delitos en el territorio",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Avenida Las Américas 46-35 Comando Metropolitana de Pereira",
            "telefono": 3149811,
            "dominio": "https:www.policia.gov.co pereira",
            "email": "deris.coman@policia.gov.co"
          },
          {
            "nombre": "Procesos de Manufactura y Diseño de máquinas COL0068216",
            "descripcion": "Impulsar el desarrollo de las empresas manufactureras colombianas, con especial énfasis en las pequeñas y medianas empresas de la región, susceptibles de alcanzar su desarrollo tecnológico por medio de la investigación aplicada y la incorporación de las tecnologías asociadas al campo de la ingeniería y el diseño mecánico.1.- Desarrollos Tecnológicos para el Sector Agroindustrial 2.- Diagnóstico y pronóstico de falla en maquinaria 3.- Diseño, modelado y reconversión de sistemas mecánicos 4.- Procesos de manufactura 5.- Propiedades de explotación de los automóviles (dinámica de los automóviles) 6.- Robótica 7.- Sistemas Dinámicos y Potencia Fluida ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "hquinte@utp.edu.co"
          },
          {
            "nombre": "Procolombia Pereira",
            "descripcion": "PROCOLOMBIA impulsa el turismo, la inversión extranjera, las exportaciones no minero energéticas y la imagen de región. Asimismo, ofrece asesoría, internacionalización empresarial y alianzas estratégicas.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 13 N° 13-40 Oficina 402 CC Uniplex, Avenida Circunvalar",
            "telefono": "57 (606) 335 5005 Ext. 52502",
            "dominio": "https:procolombia.co red-de-oficinas oficinas-en-colombia pereira",
            "email": "esanchez@procolombia.co"
          },
          {
            "nombre": "Producción más Limpia COL0014995",
            "descripcion": "El objetivo básico del Grupo de Investigación es brindar asesorías y asegurar el desarrollo y la aplicación de tecnologías que permitan por medio de proyectos, aplicar una estrategia preventiva integrada a los procesos productivos de las empresas, con el fin de reducir los riesgos para los seres humanos y el medio ambiente buscando de esta manera soluciones eco-eficientes.1.- Aire Ruido 2.- Aprovechamiento Sostenible del Recurso Forestal 3.- Construcción Sostenible y Arquitectura 4.- Eficiencia Energética y Bioenergía 5.- Producción Agrícola y Forestal 6.- Residuos Sólidos y Residuos Agroindustriales",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "UTPCarrera 27 #10-02 Álamos Pereira",
            "email": "jorgemontoya@utp.edu.co"
          },
          {
            "nombre": "PROGREZANDO COL0187191",
            "descripcion": "Desarrollar investigación en el área de Competitividad e Innovación Social, que contribuyan a la generación de Conocimiento Aplicado, implementado acciones de impacto social, que contribuyan al bien común en al ámbito local, regional y nacional. ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION PROTEGIENDONOS CARRERA 1 BIS 22 B 16",
            "email": "soporte@progrezando.com"
          },
          {
            "nombre": "Psiquiatría Neurociencias y ComunidadCOL0183497",
            "descripcion": "Contribuir al avance en el conocimiento humanista y científico de problemas de salud relacionados con Salud Mental altamente prevalentes en el Eje Cafetero, a través del desarrollo constante de producción académica, formación de talento humano y actividades de apropiación social del conocimiento, dentro de la Facultad de Ciencias de la Salud de la Universidad Tecnológica de Pereira, con proyección a la comunidad universitaria y comunidad general. 1.- Comunidad, suicidio y depresión 2.- Historia 3.- Neurociencia cognitiva y nuevas tecnologías en psiquiatría 4.- Plantas medicinales para usos neuropsiquiátricos ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "p.herrera@utp.edu.co"
          },
          {
            "nombre": "Red de Nodos de Innovación Ciencia y Tecnología",
            "descripcion": "La Red de Nodos de Innovación, Ciencia y Tecnología promueve la innovación, investigación y emprendimiento para aumentar la competitividad y sostenibilidad regional",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 27 No. 10-02 Edificio 15, Bloque D Oficina 405",
            "telefono": "(+57) (606) 313 7316",
            "dominio": "https:cidt.utp.edu.co red-de-nodos ",
            "email": "reddenodos@utp.edu.co"
          },
          {
            "nombre": "Red Departamental de Emprendimiento de Risaralda",
            "descripcion": "Red adscrita al Ministerio de Comercio, Industria y Turismo, su objetivo es impulsar el desarrollo de la cultura emprendedora en la región y liderar la toma de decisiones que inciden en políticas públicas, que contribuyan a la creación y escalamiento de las empresas.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Emprendedores",
            "direccion": "Carrera 7 # 23 - 60 Piso 3",
            "telefono": "(57)3117472152",
            "dominio": "https:www.risaraldaemprende.com ",
            "email": "risaraldaemprende@gmail.com"
          },
          {
            "nombre": "Reencafé S.A.S",
            "descripcion": "Empresa dedicada a la producción de reencauche en frío y a la comercialización e importación de llantas",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Calle 45 Nro. 8 B 45",
            "telefono": "57-60-6-336-5892",
            "dominio": "https:www.reencafe.com ",
            "email": "fernando.ramirez@reencafe.com"
          },
          {
            "nombre": "Región Administrativa y de Planificación del Eje Cafetero (RAP)",
            "descripcion": "ofrece productos como planes de desarrollo, estrategias de ordenamiento territorial, proyectos de infraestructura, programas de desarrollo económico y social, entre otros.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 12 No. 22- 37CDA Rodrigo Gómez Jaramillo Piso 2",
            "telefono": "300 524 4390",
            "dominio": "https:ejecafeterorap.gov.co ",
            "email": "contacto@ejecafeterorap.gov.co"
          },
          {
            "nombre": "Risaralda Comfort Health",
            "descripcion": "La red ofrece servicios de turismo de salud y bienestar de calidad, promoviendo la competitividad regional para atender al mercado nacional e internacional.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "CALLE 13 22 59 ALAMOS RESERVADO APTO 602",
            "telefono": "57 321 6483685",
            "dominio": "https:www.risaraldacomforthealth.com ",
            "email": "contacto@risaraldacomforthealth.com"
          },
          {
            "nombre": "Risvalley Parque Científico Tecnológico y de Innovación",
            "descripcion": "Transferir tecnología a las pequeñas y medianas Empresas de la Región del Eje Cafetero",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "email": "risvalley@gmail.com"
          },
          {
            "nombre": "ROBÓTICA APLICADA COL0067012",
            "descripcion": "Formar profesionales idóneos, investigadores, emprendedores y productivos dando solución a problemáticas a través de investigaciones, proyectos, prototipos, modelados, prácticas, estudios y métodos de trabajo. 1.- Aeronáutica 2.- Aplicaciones con Energías Alternativas 3.- Aplicaciones de Sistemas Robóticos móviles (Mecánica, Electrónica, Software) 4.- Enseñanza y aplicaciones de las Ciencias y la Tecnología 5.- Visión por computador y aprendizaje de máquina ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "jacoper@utp.edu.co"
          },
          {
            "nombre": "Ruta Competitiva IREC - Risaralda",
            "descripcion": "Ofrece fomentar la competitividad del turismo de reuniones y mantener condiciones para eventos de gran escala, Mediante gobernanza, promoción y planificación estratégica.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Pereira convention bureau",
            "telefono": "310-523-0061",
            "dominio": "https:redclustercolombia.gov.co initiatives_f 9 show-initiatives",
            "email": "asalazar@pereiraconventionbureau.com"
          },
          {
            "nombre": "SALUD COMFAMILIAR COL0134474",
            "descripcion": "Desarrollar y gestionar conocimiento científico en genética y biología molecular de Anomalías congénitas para contribuir a mejorar las condiciones de salud de la población general. 1.- Análisis automático de datos biomédicos2.- Anomalías congénitas y enfermedades huérfanas-raras3.- Cardiovascular4.- Endocrinología5.- Enfermedades infecciosas6.- Gestión clínica7.- Humanización y bienestar desde los servicios8.- Oncológicas9.- Salud femenina",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA COMFAMILIAR RISARALDA, Cra. 5 #21-30, Centro, Pereira, Risaralda",
            "email": "gporras@comfamiliar.com"
          },
          {
            "nombre": "SALUD PÚBLICA E INFECCIÓN COL0060361",
            "descripcion": "Caracterizar la producción científica en enfermedades infecciosas, particularmente en enfermedades transmitidas por vectores, zoonóticas, tropicales, parasitarias, así como en sus formas de diagnóstico, tratamiento y prevención, incluidas drogas antimicrobianas, vacunas, educación y participación comunitaria, en el ámbito particularmente latinoamericano.1.- Bibliometría de Enfermedades Infecciosas en América Latina 2.- Medicina del Viajero 3.- Aspectos clínico-epidemiológicos del Zika y otras Arbovirosis Emergentes en Colombia y América Latina 4.- Aspectos clínico-epidemiológicos del Chikungunya en Colombia y América Latina (2014-A la fecha) 5.- Enfermedades Infecciosas, tropicales y parasitarias en el embarazo 6.- Epidemiología de la Infección por VIH SIDA en el Eje Cafetero 7.- Epidemiología de las Enfermedades Tropicales 8.- Preparación ante la potencial llega de Ébola a Latinoamérica y Colombia (2014-A la fecha) 9.- Sistema de Información Geográfica de Eventos en Salud Pública 10.- Sistemas de Información Geográfico en Enfermedades Infecciosas ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "glagos@utp.edu.co"
          },
          {
            "nombre": "Salud Visual COL0023475",
            "descripcion": "Identificar principales anomalías visuales de su población entorno, innovando en diagnósticos clínicos, capacitando a los profesionales en los mismos para beneficio de la población.1.- Deporte y salud2.- Desarrollo clínico y nuevas tecnologías3.- Salud Pública y epidemiología",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA DEL AREA ANDINA Cl. 24 #8-55, Pereira, Risaralda",
            "email": "amagudelo@areandina.edu.co"
          },
          {
            "nombre": "Sayonara",
            "descripcion": "Cadena de restaurantes de hamburguesas, ensaladas y postres",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 18 6 20",
            "telefono": "57-60-6-333-0003",
            "dominio": "https:sayonara.co ",
            "email": "danielf.lozano@gmail.com"
          },
          {
            "nombre": "Secretaría de Desarrollo Económico y de Competitividad-Gobernación",
            "descripcion": "Desarrollar las políticas públicas de desarrollo empresarial que favorezcan la competitividad e internacionalización y que contribuyan al desarrollo económico en los ámbitos urbanos y rurales.",
            "tipo": "Gestión de la innovación y productividad",
            "tipoCliente": "Empresas",
            "direccion": "Calle 19 No 13-17",
            "telefono": "(57) (606) 3398300",
            "dominio": "https:www.risaralda.gov.co desarrollo_economico ",
            "email": "secretariocompetitividad@pereira.gov.co"
          },
          {
            "nombre": "Secretaría de Salud Pública y Seguridad Social Pereira",
            "descripcion": "Desarrollar acciones tendientes al mejoramiento de la calidad de vida y cuidado de la salud, en el entorno de los individuos, las familias y las comunidades del municipio de Pereira mediante procesos orientados al reconocimiento y modificación de los condicionantes o determinantes de la salud, con el fin de mitigar su impacto, reducir la vulnerabilidad, mejorar la capacidad de respuesta y las condiciones del medio ambiente",
            "tipo": "Otros",
            "tipoCliente": "Entidades públicas",
            "direccion": "Calle 19 No 13-17",
            "telefono": "(57) (606) 3398300",
            "dominio": "https:www.risaralda.gov.co salud ",
            "email": "secretariasalud@pereira.gov.co"
          },
          {
            "nombre": "SENA Risaralda",
            "descripcion": "Ofrece 57 programas con 1.700 cupos gratuitos. Destacan nuevos programas como Emprendimiento, Gestión Social y Tecnologías",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Cra. 8a. No. 26 - 79",
            "telefono": "57 6 313 5800",
            "dominio": "https:www.sena.edu.co es-co regionales zonaAndina Paginas risaralda.aspx",
            "email": "jlopezc@sena.edu.co"
          },
          {
            "nombre": "Sistemas Sostenibles de Producción Agrícola COL0022959 ",
            "descripcion": "Establecer una unidad administrativa y de gestión que permita a un colectivo de docentes llevar a cabo investigaciones en Sistemas Sostenibles de Producción Agrícola. 1.- Agroclimatología Tropical 2.- Investigación Participativa y Desarrollo Sostenible 3.- Investigación en Plantas Medicinales y Cultivos Promisorios 4.- Manejo Ecológico de Plagas y enfermedades 5.- Manejo Ecológico del Suelo 6.- Sistemas de Policultivo, Agroforestales y Silvopastoriles ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "CORPORACION UNIVERSITARIA SANTA ROSA DE CABAL UNISARCVereda el Jazmín kilómetro 4 Vía Santa Rosa de Cabal – Chinchiná",
            "email": "cristian.zuluaga@unisarc.edu.co"
          },
          {
            "nombre": "SITE SAS",
            "descripcion": "Empresa dedicada a servicios de instalación de acometidas domiciliarias de energía, gas, teléfono y agua. Igualmente a la operación, mantenimiento y expansión de alumbrados públicos, inspectoría e implementación de soluciones en calidad de la energía y calidad de la potencia.",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Entidades públicas",
            "direccion": "Calle 34 # 8B - 40Of. 201",
            "telefono": "320 777 5670",
            "dominio": "https:sitesas.co ",
            "email": "info@sitesas.co"
          },
          {
            "nombre": "Sociedad en Movimiento",
            "descripcion": "Contribuir al desarrollo socioeconómico sostenible del departamento de Risaralda, basado en el conocimiento a través de la Movilización Social con la participación activa de los actores en el territorio",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Unversidad tecnológica de Pereira Edificio 15C - Oficina 103",
            "telefono": 3137547,
            "dominio": "https:www.sociedadenmovimiento.com es ",
            "email": "conocimientorisaralda@gmail.com"
          },
          {
            "nombre": "SUJETO, MENTE Y COMUNIDAD (SUMECO) COL0050679",
            "descripcion": "Generar procesos de investigación formativa, formación investigativa e investigación avanzada desde un enfoque interdisciplinario respecto a fenómenos y dinámicas psicológicas, sociales y culturales, teniendo presente las relaciones entre sujeto y sus prácticas en la comunidad. 1.- Comunicación, Educación y tecnología 2.- Gestión de procesos de comunicación 3.- Intersubjetividades, contextos y desarrollo",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unad Carrera 23 con Diagonal 25F Barrio Milán",
            "email": "angel.diaz@unad.edu.co"
          },
          {
            "nombre": "TecnoAcademia - Risaralda",
            "descripcion": "Ofrece a los estudiantes de colegio de Risaralda desarrollar sus competencias a través de la formación y la ejecución de proyectos de investigación y desarrollo experimental en una o varias ramas de las ciencias básicas y aplicadas como: Biotecnología. Nanotecnología. Ciencias básicas.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Entidades públicas",
            "direccion": "Calle 73 Bis con Cra. 21 Comuna 9 barrió Cesar Augusto López",
            "telefono": "(6)3135800 Ext. 63330",
            "dominio": "https:tecnoacademiarisaralda.com ",
            "email": "tecnoacademiarisaralda@gmail.com"
          },
          {
            "nombre": "TECNOLOGÍA MECÁNICA COL0035289",
            "descripcion": "Propender por el perfeccionamiento de los procesos productivos de la región en los aspectos de selección, operación, mantenimiento, rediseño, reacondicionamiento y manufactura de equipos y sistemas de potencia mecánica, a través de la formación investigativa y la actualización en procesos de transferencia tecnológica. 1.- Energías renovables 2.- Mantenimiento industrial 3.- Mecatrónica 4.- Procesos de manufactura 5.- Termo fluidos ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "edgarsalazar@utp.edu.co"
          },
          {
            "nombre": "Tecnoparque SENA - Nodo Pereira",
            "descripcion": "Ofrece 4 líneas tecnológicas: Biotecnología y nanotecnología, Tecnologías virtuales, Diseño e Ingeniera y Electrónica y telecomunicaciones, a la comunidad SENA, estudiantes universitarios, empresas y comunidad en general, en el desarrollo de sus proyectos de investigación aplicada, desarrollo e innovación",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Personas Naturales",
            "direccion": "Carrera 8 No. 26-79",
            "telefono": "3135800 IP 63122",
            "dominio": "https:www.sena.edu.co es-co formacion Paginas tecnoparques.aspx",
            "email": "dosorioq@sena.edu.co"
          },
          {
            "nombre": "Tecnovida SAS",
            "descripcion": "Prestación de servicios de diagnóstico por imágenes y diagnóstico cardiovascular",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Sociedad",
            "direccion": "Calle 24 # 5 – 41 piso 3",
            "telefono": "(6) 324 87 95",
            "dominio": "https:tecnovida.co ",
            "email": "recepcion@tecnovida.co"
          },
          {
            "nombre": "TEINNOVA CDITI COL0163609",
            "descripcion": "Aportar al proceso formativo de los aprendices profundizando con aplicaciones de alto impacto tecnológico. 1.- Diseño de la Moda, Manufactura Textil y Cuero 2.- Diseño y fabricación de Sistemas Mecánicos y Autotronicos 3.- Educación, Pedagogía, Transformación Social e Innovación 4.- Sistemas Electrónicos, Automatización y Control de Procesos 5.- Sistemas Productivos, Organizacionales e Industriales 6.- Tecnologías para el Hábitat, las Energías Libres y el Desarrollo Sostenible 7.- Telemática y Desarrollo de TIC ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "SERVICIO NACIONAL DE APRENDIZAJE SENA, Dg. 27a #4-2 a 4-114, Dosquebradas, Risaralda",
            "email": "mcortesr@sena.edu.co"
          },
          {
            "nombre": "TENDENCIA ECONÓMICA MUNDIAL COL0033121",
            "descripcion": "Desarrollar procesos de investigación acordes con el proceso de globalizan económica y diseñar modelos para la incorporación del país dentro del nuevo contexto económico.1.- Competitividad 2.- Econometría 3.- Negocios Internacionales 4.- Teoría y política económica",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-101",
            "email": "isabel.redondo@unilibre.edu.co"
          },
          {
            "nombre": "Textiles Omnes SA",
            "descripcion": "fabricación de tejidos de la más alta calidad, Tejidos de Refuerzo para Bandas Transportadoras. Tejidos para la Industria Llantera, Geotextiles, Tejidos para Protección Balística, Filtración Y Recubrimientos Vinílicos.",
            "tipo": "Producción elaboración de bienes productos",
            "tipoCliente": "Empresas",
            "direccion": "Cr 16 36 98",
            "telefono": "57-60-6-341-9239",
            "dominio": "http:www.textilesomnes.com ",
            "email": "htoulemonde@textilesomnes.com"
          },
          {
            "nombre": "TransFórmate COL0154127",
            "descripcion": "Diseñar y desarrollar algoritmos matemáticos que modelen los sistemas de transporte con sus diferentes características, y que permitan su optimización o mejoramiento. 1.- Desarrollo de software 2.- Ingeniería para la agricultura 3.- Investigación de Operaciones aplicada en Transporte 4.- Sistemas Inteligentes de Transporte 5.- Smart Cities 6.- Tecnologías de la Información y la Comunicación 7.- Transporte Público. ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "cmarin@integra.com.co"
          },
          {
            "nombre": "Transiciones y política COL0066516",
            "descripcion": "Generar conocimiento en torno a fenómenos sociales y políticos interpretando las dimensiones institucionales, transicionales e ilegales presentes en las sociedades contemporáneas, a partir de lecturas transdisciplinares, relacionales, históricas y críticas.1.- Subjetividades, género y procesos políticos 2.- Poder, memoria y violencia",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "Universidad Católica de Pereira, Las Americas, Avenida Sur, Cra 21 #49-95, Pereira, Risaralda",
            "email": "gina.arias@ucp.edu.co"
          },
          {
            "nombre": "Trueque COL0066688",
            "descripcion": "Generar conocimientos desde la gestión comercial que permitan la sustentabilidad de las organizaciones. Establecer los mecanismos necesarios para desarrollar actividades de emprendimiento. Fortalecer los vínculos con los gremios, empresarios y demás instituciones que permitan resolver problemáticas de la gestión comercial.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Sociedad",
            "direccion": "unilibre pereira Avenida Las Américas Carrera 28 No. 96-104",
            "email": "jesusd.valencias@unilibre.edu.co"
          },
          {
            "nombre": "Universidad Católica de Pereira",
            "descripcion": "Universidad Privada, ubicada en Pereira, ofrece 13 pregrados y 24 posgrado.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "CARRERA 21 49 95 AVENIDA DE LAS AMERICAS",
            "telefono": 6063124000,
            "dominio": "https:www.ucp.edu.co ",
            "email": "dantorres@utp.edu.co"
          },
          {
            "nombre": "Universidad Cooperativa de Colombia Sede Pereira",
            "descripcion": "Ofrece programas de pregrados, posgrados y técnicos laborales promoviendo el desarrollo de las capacidades pertinentes a las necesidades territoriales",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "La Julita, vía Pinares",
            "telefono": 3193394704,
            "dominio": "https:ucc.edu.co campus-pereira-cartago",
            "email": "comunicaciones.per@ucc.edu.co"
          },
          {
            "nombre": "Universidad del Quindio Sede Pereira",
            "descripcion": "La universidad ofrece programas de Seguridad y Salud en el Trabajo y Tecnología en Obras Civiles, fortaleciendo su presencia territorial y bienestar comunitario",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Colegio Salesiano San Juan Bosco, Carrera 21 N° 21T - 84, Sector los Molinos Dosquebradas, detrás de Comfamiliar Risaralda",
            "telefono": "57 (606) 7359300 Ext: 200 y 201",
            "dominio": "https:www.uniquindio.edu.co publicaciones 983 pereira ",
            "email": "pereira@uniquindio.edu.co"
          },
          {
            "nombre": "Universidad EAFIT sede Pereira",
            "descripcion": "EAFIT Pereira se ha destacado en educación continua, inglés como segunda lengua y consultoría para el sector empresarial regional. Además, amplía su alcance mediante convenios regionales.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Empresas",
            "direccion": "Carrera 19 #12-70 Megacentro Pinares",
            "telefono": "606 3214119",
            "dominio": "https:www.eafit.edu.co eafit-pereira",
            "email": "cice_coorcicepereira@eafit.edu.co"
          },
          {
            "nombre": "Universidad Libre",
            "descripcion": "Entidad Privada, laica, múltiples sedes nacionales, afiliaciones internacionales, 67 pregrados y 164 posgrados",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Belmonte Avenida Las Américas Carrera 28 No. 96-102",
            "telefono": "(6)3155600",
            "dominio": "http:unilibrepereira.edu.co inicio",
            "email": "investigaciones.pei@unilibre.edu.co"
          },
          {
            "nombre": "Universidad Nacional Abierta y a Distancia - UNAD Dosquebradas",
            "descripcion": "Ofrece programas de pregrado y posgrado en diversas áreas del conocimiento, tales como ingeniería, administración, ciencias sociales, educación, salud, entre otras.",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Carrera 23 con Diagonal 25F Barrio Milán",
            "telefono": "606 - 3116599",
            "dominio": "https:occidente.unad.edu.co dosquebradas",
            "email": "hugo.ocampo@unad.edu.co"
          },
          {
            "nombre": "Universidad Tecnológica de Pereira",
            "descripcion": "Ofrece programas académicos en ingeniería, salud, ambiente, educación, artes, ciencias, tecnología y agricultura, incluyendo doctorados y maestrías",
            "tipo": "Formación y capacitación",
            "tipoCliente": "Personas Naturales",
            "direccion": "Carrera 27 # 10-02 Los Álamos",
            "telefono": "57-60-6-313-7300",
            "dominio": "http:www.utp.edu.co ",
            "email": "caba@utp.edu.co"
          },
          {
            "nombre": "Vulnerabilidad y Salud Publica COL0070081",
            "descripcion": "Generar, transferir y aplicar conocimiento relacionado con vulnerabilidad y salud publica 1.- Calidad de vida 2.- Cáncer 3.- Determinantes sociales de la salud 4.- Educación en Salud 5.- Epidemiologia Clínica 6.- Población confinada 7.- Población desplazada 8.- Población privada de la libertad 9.- Resiliencia 10.- Salud Publica 11.- Violencia 12.- Vulnerabilidad Social ",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "Universidad Tecnológica de Pereira Carrera 27 #10-02 Álamos Pereira",
            "email": "gamor@utp.edu.co"
          },
          {
            "nombre": "Zion ING SAS",
            "descripcion": "Empresa dedicada a prestar servicios de medición industrial, ahorro energético y tecnología de plasma para el tratamiento de residuos en cualquier toxicidad y estado de la materia.",
            "tipo": "Asesoría y consultoría",
            "tipoCliente": "Empresas",
            "direccion": "Calle 19# 12-69, Of D-201",
            "telefono": "57 315 829 5423",
            "dominio": "https:zioning.com es inicio",
            "email": "info@zioning.com"
          },
          {
            "nombre": "ZIPATEFI (Zona de Investigaciones de Posgrados, Terapia Respiratoria y Fisioterapia de Areandina) COL0056618",
            "descripcion": "Desarrollar procesos investigativos que faciliten el diagnóstico de problemas en comunidades, instituciones e individuos, para plantear posibles soluciones, con la evaluación de su impacto y difusión de resultados en revistas indexadas y en eventos científicos. 1.- Salud Pública y Epidemiología",
            "tipo": "Servicios tecnológicos",
            "tipoCliente": "Empresas",
            "direccion": "FUNDACION UNIVERSITARIA DEL AREA ANDINA Cl. 24 #8-55, Pereira, Risaralda",
            "email": "mgomez3@areandina.edu.co"
          }
        ];

        const keydata = [];
        const entidades = [];
        const servicios = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const contrasena = await generatePasswordTemporal();
          const key = await generateKeyWord()

          element.tipoLabel = element.tipo;
          element.tipo = 2;
          element.cargo = 'No registra';
          element.password = await bcrypt.hash(contrasena, 10);
          element.contrasena = contrasena;
          element.primerIngreso = 0;
          element.registroValidado = 1;
          element.key = key;
          element.keydata = await bcrypt.hash(key, 10);
        }

        const dataUsers = await UsersModel.bulkCreate(data, { transaction: t })

        for (let index = 0; index < dataUsers.length; index++) {
          const element = dataUsers[index];
          const key = await generateKeyWord();

          keydata.push({
            word: 'U' + '-' + element?.email?.split('@')[0] + index + 2,
            idRegistroAsociado: element.id,
            key: data.find((e) => e.email == element.email)?.key
          });
          entidades.push({
            nombre: element.nombre,
            tipo: 2,
            telefono: element.telefono,
            email: element.email,
            descripcion: element.descripcion,
            idTipoNaturalezaJuridica: 1,
            idUserResponsable: element.id,
            contactonombre: element.nombre,
            contactoCorreo: element.nombre,
            contactoCorreo: element.email,
            contactoTelefono: element.telefono,
            direccion: 'No registra',
            keydata: await bcrypt.hash(key, 10),
            key
          })

        }
        const entitys = await EntidadesModel.bulkCreate(entidades, { transaction: t });

        const tipos = {
          'Promoción y divulgación científica': 10,
          'Servicios tecnológicos': 11,
          'Apropiación social de conocimiento': 12,
          'Formación y capacitación': 13,
          'Gestión de la innovación y productividad': 14,
          'Comercialización de bienes/productos': 15,
          'Producción/elaboración de bienes/productos ': 16,
          'Otros': 17,
          'Centros de ciencia': 18,
          'Centros de desarrollo tecnológico ': 19,
          'Centros de innovación y productividad': 20,
          'Centros o institutos de innovación': 21,
          'Sociedad': 22,
          'Entidades públicas': 23,
          'Entidad privadas': 24,
          'Empresas': 25,
          'Emprendedores': 26,
          'Startup': 27,
          'Entidades de educación superior': 28,
          'Entidades educativas ': 29,
          'ONG ': 30,
          'Corporaciones ambientales': 31,
          'Personas Naturales': 32,
          'Otros': 33,
        }

        for (let index = 0; index < entitys.length; index++) {
          const element = entitys[index];
          const key = await generateKeyWord();
          const entity = data.find((e) => e.email == element.email)
          keydata.push({
            word: 'EN' + '-' + element?.email?.split('@')[0],
            idRegistroAsociado: element.id,
            key: entity.key
          });

          servicios.push({
            nombre: element.nombre,
            descripcion: entity.descripcion,
            estado: 1,
            imagen: '/img',
            idTipoServicio: tipos[entity.tipoLabel] ?? 17,
            idTipoClienteServicio: tipos[entity.tipoCliente] ?? 33,
            keydata: await bcrypt.hash(key, 10),
            key,
            createdBy: element.idUserResponsable
          })
        }

        const services = await ServiciosTecnologicosModel.bulkCreate(servicios, { transaction: t });

        for (let index = 0; index < services.length; index++) {
          const element = services[index];
          keydata.push({
            word: 'SE' + '-' + element?.nombre,
            idRegistroAsociado: element.id,
            key: servicios.find((e) => e.nombre == element.nombre).key
          })
        }

        await KeyWordsModel.bulkCreate(keydata, { transaction: t });

        const dataScript = data.map((e) => {
          return {
            email: e.email,
            password: e.contrasena
          }
        })

        return res.status(200).json({ msg: 'success', data: dataScript });

      })
    } catch (error) {
      throw error;
    }
  }
}
module.exports = GeneralsCTR;

