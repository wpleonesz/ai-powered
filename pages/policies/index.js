import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import store from '@redux/store';
import theme from '@styles/theme';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Image from 'next/image';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FacebookIcon from '@material-ui/icons/Facebook';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InstagramIcon from '@material-ui/icons/Instagram';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#384152',
    borderBottom: '1px solid #12738E',
    color: '#ffffff',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  root2: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default function Policies() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Head>
        <title>POLÍTICAS DE PRIVACIDAD | UEA</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1.0, width=device-width, height=device-height"
        />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="md">
            <br /> <br />
            <Grid container spacing={1}>
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Image
                  src="/assets/images/image_placeholder.png"
                  width={350}
                  height={100}
                  alt="Icon"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h4"
                  align="center"
                  color="primary"
                  gutterBottom
                >
                  POLÍTICAS DE PRIVACIDAD DE LA UNIVERSIDAD ESTATAL AMAZONICA
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      POLÍTICAS DE PRIVACIDAD DE LOS SITIOS WEB DE LA
                      UNNIVERSIDAD ESTATAL AMAZONICA
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      La Universidad Estatal Amazónica, a traves del siguiente
                      instrumento, pone en conocimiento de todas los usuarios
                      que accedan a sus portales, la Política de Privacidad de
                      la Información y Datos Personales que a continuación se
                      detalla, estableciéndose que, al acceder a cualquiera de
                      sus portales, quien lo realice, estará conociéndola y
                      aceptándola.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      1. Objetivo
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      Establecer las políticas de privacidad de la Universidad
                      Estatal Amazónica (UEA), mediante la unificación de
                      criterios técnicos, legales y administrativos sobre el
                      servicio, esta política informa a los(as) usuarios(as)
                      respecto del tratamiento de la información y datos
                      personales que se recogen a través de las plataformas y
                      sistemas computacionales de la universidad.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      2. Alcance
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      En la presente Política de Privacidad se establecen los
                      términos en que Universidad Estatal Amazónica usa y
                      protege la información que es proporcionada por sus
                      usuarios al momento de utilizar su sitio web. Esta
                      compañía está comprometida con la seguridad de los datos
                      de sus usuarios. Cuando le pedimos llenar los campos de
                      información personal con la cual usted pueda ser
                      identificado, lo hacemos asegurando que sólo se empleará
                      de acuerdo con los términos de este documento. Sin
                      embargo, esta Política de Privacidad puede cambiar con el
                      tiempo o ser actualizada por lo que le recomendamos y
                      enfatizamos revisar continuamente esta página para
                      asegurarse que está de acuerdo con dichos cambios.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      3. Datos de recolección
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      La Universidad Estatal Amazónica a través de su sitio Web,
                      recepta los siguientes datos personales de sus usuarios.
                      <p>
                        <b>Estudiantes</b>
                      </p>
                      <ul>
                        <li>Número de cédula de identidad;</li>
                        <li>Teléfono fijo;</li>
                        <li>Información demográfica;</li>
                        <li>Teléfono celular;</li>
                        <li>Correo electrónico institucional; y,</li>
                        <li>Correo electrónico personal.</li>
                      </ul>
                      <p>
                        <b>Docentes</b>
                      </p>
                      <ul>
                        <li>Número de cédula de identidad;</li>
                        <li>Teléfono fijo;</li>
                        <li>Información demográfica;</li>
                        <li>Teléfono celular;</li>
                        <li>Correo electrónico institucional; y,</li>
                        <li>Correo electrónico personal.</li>
                      </ul>
                      <p>
                        <b>Personal administrativo</b>
                      </p>
                      <ul>
                        <li>Número de cédula de identidad;</li>
                        <li>Teléfono fijo;</li>
                        <li>Información demográfica;</li>
                        <li>Teléfono celular;</li>
                        <li>Correo electrónico institucional; y,</li>
                        <li>Correo electrónico personal.</li>
                      </ul>
                      Así mismo cuando sea necesario podrá ser requerida,
                      información específica para procesar algún pedido o
                      realizar una entrega.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      4. Finalidad
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      En el marco de la Ley de Protección de Datos Personales
                      aprobado el 10 de mayo de 2021 por la Asamblea Nacional,
                      la Universidad Estatal Amazónica utilizará la información
                      proporcionada únicamente para los siguientes fines:
                      <ul>
                        <li>
                          Emplear las políticas de correo electrónico de la
                          Universidad Estatal Amazónica.{' '}
                        </li>
                        <li>
                          Emplear la información con el fin de proporcionar el
                          mejor servicio posible, particularmente para mantener
                          un registro de usuarios, de pedidos en caso de que
                          aplique, y mejorar nuestros productos y servicios.
                        </li>
                        <li>
                          Gestión de solicitudes o requerimientos
                          administrativos, institucionales o técnicos
                          concerniente a los servicios de la institución, a
                          través del cual se usa información personal como el
                          nombre, cédula, correo institucional, correo personal,
                          teléfono, información demográfica;
                        </li>
                        <li>
                          Responder directamente a sus solicitudes de
                          información o requerimientos institucionales,
                          administrativos y técnicos;
                        </li>
                        <li>
                          Notificar periódicamente a través de nuestro sitio con
                          ofertas especiales, comunicados, nuevos productos y
                          otra información publicitaria que consideremos
                          relevante para usted o que pueda brindarle algún
                          beneficio, estos correos electrónicos serán enviados a
                          la dirección que usted proporcione y podrán ser
                          cancelados en cualquier momento;
                        </li>
                        <li>
                          Datos personales de menores de edad: La Universidad
                          Estatal Amazónica, no recopila datos de o sobre
                          menores de edad. Si por error se recopiló información
                          personal de un menor de edad, inmediatamente se
                          eliminará esa información. En el caso que Usted,
                          considere que tenemos alguna información de esta
                          naturaleza, contáctenos para su inmediata eliminación;
                        </li>
                        <li>
                          Universidad Estatal Amazónica está altamente
                          comprometida para cumplir con el compromiso de
                          mantener su información segura. Usamos los sistemas
                          más avanzados y los actualizamos constantemente para
                          asegurarnos que no exista ningún acceso no autorizado.
                        </li>
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      5. Proceso para ejercer derecho de acceso y rectificación
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      La Universidad Estatal Amazónica puede actualizar su
                      Política de Privacidad cuando sea necesario. Si se
                      realizaran cambios sustanciales, se notificará mediante un
                      aviso en su sitio web o redes sociales antes de que el
                      cambio entre en vigencia. Se recomienda revisar
                      periódicamente la página web o redes sociales oficiales
                      para obtener la información más reciente sobre nuestras
                      prácticas de privacidad.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      6. Uso de Cookies
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      <p>
                        La Universidad Estatal Amazónica puede utilizar sus
                        datos personales, incluidos los datos recopilados como
                        resultado de la navegación del sitio y los protocolos y
                        registros electrónicos para ayudar a crear y
                        personalizar el contenido del sitio web, mejorar la
                        calidad del sitio web, realizar un seguimiento de la
                        capacidad de respuesta de los servicios entregados
                      </p>
                      <p>
                        La Universidad Estatal Amazónica no comparte los datos
                        personales del usuario, nuestro sitio web emplea las
                        cookies para poder identificar las páginas que son
                        visitadas y su frecuencia. Esta información es empleada
                        únicamente para análisis estadístico y después la
                        información se elimina de forma permanente. Usted puede
                        eliminar las cookies en cualquier momento desde su
                        ordenador. Sin embargo, las cookies ayudan a
                        proporcionar un mejor servicio de los sitios web, estás
                        no dan acceso a información de su ordenador ni de usted,
                        a menos de que usted así lo quiera y la proporcione
                        directamente, visitas a una web. Usted puede aceptar o
                        negar el uso de cookies, sin embargo, la mayoría de los
                        navegadores aceptan cookies automáticamente pues sirve
                        para tener un mejor servicio web. También usted puede
                        cambiar la configuración de su ordenador para declinar
                        las cookies. Si se declinan es posible que no pueda
                        utilizar algunos de nuestros servicios.
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      7. Enlaces a terceros
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      Este sitio web pudiera contener enlaces a otros sitios que
                      pudieran ser de su interés. Una vez que usted de clic en
                      estos enlaces y abandone nuestra página, ya no tenemos
                      control sobre al sitio al que es redirigido y por lo tanto
                      no somos responsables de los términos o privacidad ni de
                      la protección de sus datos en esos otros sitios terceros.
                      Dichos sitios están sujetos a sus propias políticas de
                      privacidad por lo cual es recomendable que los consulte
                      para confirmar que usted está de acuerdo con estas.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      8. Medidas para precautelar la seguridad de los datos
                      personales
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      La Universidad Estatal Amazónica protege la
                      confidencialidad, integridad y disponibilidad de los
                      activos de información al seguir un enfoque de
                      administración de riesgos basado en políticas, estándares,
                      pautas y procedimientos para cumplir con los objetivos de
                      seguridad al tiempo que respalda los objetivos.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      9. Base legal que sustenta el tratamiento de los datos
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      <p>
                        La Universidad Estatal Amazónica fundamenta el
                        tratamiento que da a los datos personales de los
                        usuarios en los siguientes instrumentos legales, que se
                        citan a continuación:
                      </p>
                      <p>
                        Ley Orgánica del Sistema Nacional de Registro de Datos
                        Públicos, publicada en el Registro Oficial Suplemento
                        No. 162 de 31 de marzo de 2010; artículo 4.-
                        <i>
                          “Responsabilidad de la información. - Las
                          instituciones del sector público y privado y las
                          personas naturales que actualmente o en el futuro
                          administren bases o registros de datos públicos, son
                          responsables de la integridad, protección y control de
                          los registros y bases de datos a su cargo. Dichas
                          instituciones responderán por la veracidad,
                          autenticidad, custodia y debida conservación de los
                          registros. La responsabilidad sobre la veracidad y
                          autenticidad de los datos registrados es exclusiva de
                          la o el declarante cuando esta o este provee toda la
                          información (…)”
                        </i>
                        .
                      </p>
                      <p>
                        El artículo 6 de la referida Ley, determina:
                        <i>
                          “Accesibilidad y confidencialidad. - Son
                          confidenciales los datos de carácter personal, tales
                          como: ideología, afiliación política o sindical,
                          etnia, estado de salud, orientación sexual, religión,
                          condición migratoria y los demás atinentes a la
                          intimidad personal y en especial aquella información
                          cuyo uso público atente contra los derechos humanos
                          consagrados en la Constitución e instrumentos
                          internacionales (…)”
                        </i>
                        .
                      </p>
                      <p>
                        El Código Orgánico de la Economía Social de los
                        Conocimientos, Creatividad e Innovación, publicado en el
                        Registro Oficial Suplemento No. 899 de 9 de diciembre de
                        2016; Disposición General Vigésima Séptima. -{' '}
                        <i>
                          “(…) El tratamiento de datos personales que incluya
                          acciones tales como la recopilación, sistematización y
                          almacenamiento de datos personales, requerirá la
                          autorización previa e informada del titular. No se
                          requerirá de la autorización del titular cuando el
                          tratamiento sea desarrollado por una institución
                          pública y tenga una finalidad estadística o
                          científica; de protección a la salud o seguridad; o
                          sea realizado como parte de una política pública de
                          garantía de derechos constitucionalmente reconocidos”
                        </i>
                        .
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.root}
                  >
                    <Typography className={classes.heading}>
                      10. Términos y condiciones
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography align="justify">
                      El uso del sitio Web, implica la aceptación expresa de los
                      presentes términos y condiciones de uso.
                      <ul>
                        <li>
                          La Universidad Estatal Amazónica dispone de sitios web
                          para prestar información a los titulares del servicio
                          concernientes al servicio de gestión universitarios,
                          así como para canalizar requerimientos académicos,
                          administrativos, legales y técnicos concernientes a
                          los servicios públicos de la educación superior.
                        </li>
                        <li>
                          Respecto a los ciudadanos que dispongan del servicio
                          (docentes, estudiantes y personal administrativo),
                          podrán acceder a los servicios de gestión
                          universitarios.
                        </li>
                        <li>
                          Los datos que han recibido tratamiento estadístico
                          pueden estar disponibles en formatos abiertos, para
                          facilitar su utilización.
                        </li>
                        <li>
                          Si desea: acceder, corregir, enmendar o borrar
                          cualquier información personal que poseamos sobre
                          usted, registrar una queja, o simplemente desea más
                          información, contáctenos a través del correo
                          electrónico soporte@uea.edu.ec o redes sociales.
                        </li>
                      </ul>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <ButtonGroup
                  disableElevation
                  variant="contained"
                  color="primary"
                >
                  <Button
                    variant="link"
                    startIcon={<InstagramIcon color="primary" />}
                    href="https://www.instagram.com/uea.edu.ec/?hl=es-la"
                    target="_blank"
                  >
                    Instagram
                  </Button>
                  <Button
                    variant="link"
                    startIcon={<FacebookIcon color="primary" />}
                    href="https://es-la.facebook.com/ueaeduec/"
                    target="_blank"
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="link"
                    startIcon={<LanguageIcon color="primary" />}
                    href="https://www.uea.edu.ec/"
                    target="_blank"
                  >
                    Página web
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                direction="row"
                justifyContent="center"
                alignItems="center"
              ></Grid>
            </Grid>
          </Container>
          <SnackbarProvider maxSnack={3}></SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
}

Policies.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
