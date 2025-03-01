import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { MdRefresh } from "react-icons/md";
import { LocalNotifications } from '@capacitor/local-notifications';
import './../theme/variables.css';

// Define type for categories
type Category = keyof typeof phrases;

// Frases categorizadas
const phrases = {
  ORDEN: [
    { text: "¿Por qué el orden es mi mejor aliado para el éxito?" },
    { text: "¿Por qué estoy organizando mi vida para alcanzar mis sueños?" },
    { text: "¿Por qué un entorno organizado genera una mente clara?" },
    { text: "¿Por qué mi espacio refleja mi paz interior?" },
    { text: "¿Por qué la organización me da control sobre mi tiempo?" },
    { text: "¿Por qué cada acción que realizo tiene un propósito claro?" },
    { text: "¿Por qué con orden, cada tarea se vuelve más manejable?" },
    { text: "¿Por qué soy disciplinado y sigo una rutina organizada?" },
    { text: "¿Por qué el orden en mi entorno me da paz y serenidad?" },
    { text: "¿Por qué la organización es la clave para lograr mis objetivos?" },
    { text: "¿Por qué mantengo todo en su lugar para que todo fluya con facilidad?" },
    { text: "¿Por qué cada día organizo mis tareas para ser más productivo?" },
    { text: "¿Por qué mi vida está llena de estructura y claridad?" },
    { text: "¿Por qué me siento libre cuando todo está en su lugar?" },
    { text: "¿Por qué el caos no tiene lugar en mi vida organizada?" },
    { text: "¿Por qué mi mente se siente más tranquila cuando mi entorno está ordenado?" },
    { text: "¿Por qué planificar me da el control sobre mis metas?" },
    { text: "¿Por qué la organización es un hábito que fortalece mi vida?" },
    { text: "¿Por qué el orden en mi espacio me permite enfocarme en lo que importa?" },
    { text: "¿Por qué el desorden no es una opción para mí, el orden es mi camino?" },
    { text: "¿Por qué soy una persona organizada y productiva?" },
    { text: "¿Por qué el orden en mis pensamientos me ayuda a tomar mejores decisiones?" },
    { text: "¿Por qué cada tarea que realizo la hago con precisión y orden?" },
    { text: "¿Por qué la organización me ayuda a reducir el estrés?" },
    { text: "¿Por qué organizo mi día para aprovechar al máximo cada momento?" },
    { text: "¿Por qué la organización me permite alcanzar mis metas con mayor facilidad?" },
    { text: "¿Por qué el orden no es solo físico, también es mental?" },
    { text: "¿Por qué cada momento que paso organizando me acerca más a mis sueños?" },
    { text: "¿Por qué al mantener el orden, elimino distracciones?" },
    { text: "¿Por qué la claridad es el resultado de un entorno organizado?" },
    { text: "¿Por qué con el orden, mi energía fluye sin obstáculos?" },
    { text: "¿Por qué organizo mi espacio para que mi vida fluya con facilidad?" },
    { text: "¿Por qué un día organizado es un día exitoso?" },
    { text: "¿Por qué cada tarea está alineada con mis metas y sueños?" },
    { text: "¿Por qué el orden es mi ruta hacia la calma?" },
    { text: "¿Por qué el orden en mi vida me da la libertad de concentrarme en lo esencial?" },
    { text: "¿Por qué la organización mejora mi eficiencia y productividad?" },
    { text: "¿Por qué soy eficiente porque mi entorno está organizado?" },
    { text: "¿Por qué la disciplina y el orden son la base de mi éxito?" },
    { text: "¿Por qué puedo encontrar todo lo que necesito porque mantengo el orden?" },
    { text: "¿Por qué la organización es el primer paso hacia el logro de mis metas?" },
    { text: "¿Por qué cada acción que realizo tiene un propósito y está bien organizada?" },
    { text: "¿Por qué mi vida está llena de orden y claridad?" },
    { text: "¿Por qué organizo mi espacio para liberar mi mente?" },
    { text: "¿Por qué soy capaz de mantener mi vida organizada a pesar de los desafíos?" },
    { text: "¿Por qué el orden en mi vida trae paz y claridad?" },
    { text: "¿Por qué el orden me permite enfocarme en lo que realmente importa?" },
    { text: "¿Por qué la organización es la clave para una vida más tranquila?" },
    { text: "¿Por qué el orden me ayuda a ser más eficiente y menos distraído?" },
    { text: "¿Por qué soy constante y organizado en todo lo que hago?" },
    { text: "¿Por qué cada tarea organizada es un paso más hacia mi éxito?" },
    { text: "¿Por qué al organizar mi espacio, organizo también mi mente?" },
    { text: "¿Por qué la organización crea un ambiente propicio para el éxito?" },
    { text: "¿Por qué estoy rodeado de orden y eso me impulsa a ser más productivo?" },
    { text: "¿Por qué con un espacio organizado, mi mente está más enfocada?" },
    { text: "¿Por qué el orden me da claridad para tomar decisiones acertadas?" },
    { text: "¿Por qué la organización es una inversión en mi bienestar?" },
    { text: "¿Por qué soy una persona estructurada que disfruta de la organización?" },
    { text: "¿Por qué organizo mi vida con el fin de lograr mis sueños?" },
    { text: "¿Por qué cada cosa en su lugar, cada tarea bajo control?" },
    { text: "¿Por qué mi entorno organizado me inspira a ser más creativo?" },
    { text: "¿Por qué el orden es el camino hacia una vida más plena y feliz?" },
    { text: "¿Por qué mi vida está equilibrada gracias a la organización?" },
    { text: "¿Por qué la organización me permite alcanzar mis objetivos con claridad?" },
    { text: "¿Por qué mantengo el orden en todo lo que hago?" },
    { text: "¿Por qué la organización es mi herramienta para el éxito?" },
    { text: "¿Por qué mi mente funciona mejor cuando mi entorno está ordenado?" },
    { text: "¿Por qué mantengo el orden para ser más efectivo y menos estresado?" },
    { text: "¿Por qué la organización me da la libertad de concentrarme en mis sueños?" },
    { text: "¿Por qué soy una persona organizada que maneja su tiempo con sabiduría?" },
    { text: "¿Por qué la estructura en mi vida me da estabilidad y paz?" },
    { text: "¿Por qué el orden no solo está en mi espacio, también está en mis pensamientos?" },
    { text: "¿Por qué la organización me da control sobre mi vida y mi tiempo?" },
    { text: "¿Por qué al mantener el orden, elimino el caos y la confusión?" },
    { text: "¿Por qué la organización mejora mi calidad de vida y mi bienestar?" },
    { text: "¿Por qué cada día encuentro tiempo para organizar mi entorno y mis tareas?" },
    { text: "¿Por qué mi espacio organizado es un reflejo de mi mente ordenada?" },
    { text: "¿Por qué el orden es un camino hacia el éxito y la productividad?" },
    { text: "¿Por qué cada acción organizada me acerca a mis sueños y objetivos?" },
    { text: "¿Por qué organizo mi vida para maximizar mi tiempo y mi energía?" },
    { text: "¿Por qué al organizar mi entorno, organizo mi futuro?" },
    { text: "¿Por qué la organización me da el enfoque necesario para alcanzar mis metas?" },
    { text: "¿Por qué mantengo el orden para disfrutar de una vida más tranquila?" },
    { text: "¿Por qué soy capaz de mantener el orden en medio del caos?" },
    { text: "¿Por qué la organización me permite disfrutar de la paz y la serenidad?" },
    { text: "¿Por qué la disciplina y la organización son mis aliados en el camino hacia el éxito?" },
    { text: "¿Por qué mi vida fluye con facilidad cuando está organizada?" },
    { text: "¿Por qué el orden me permite avanzar sin distracciones?" },
    { text: "¿Por qué la organización es mi estrategia para una vida exitosa?" },
    { text: "¿Por qué con orden, tengo más tiempo para disfrutar de las cosas importantes?" },
    { text: "¿Por qué mantengo mi espacio organizado porque me ayuda a sentirme bien?" },
    { text: "¿Por qué la organización me permite gestionar mi tiempo con sabiduría?" },
    { text: "¿Por qué el orden en mi entorno me da claridad mental?" },
    { text: "¿Por qué me esfuerzo por mantener el orden en todo lo que hago?" },
    { text: "¿Por qué organizar mi vida es una forma de cuidar mi bienestar?" },
    { text: "¿Por qué el orden me permite ser más eficiente y menos estresado?" },
    { text: "¿Por qué al estar organizado, puedo enfocarme en mis sueños y objetivos?" },
    { text: "¿Por qué la organización es el primer paso para lograr todo lo que deseo?" },
    { text: "¿Por qué soy una persona organizada y disfruto de los resultados?" },
    { text: "¿Por qué cada día elijo el orden como camino hacia mi éxito y bienestar?" }
  ],
  AMOR: [
    { "text": "¿Por qué el amor siempre ilumina mi camino?" },
    { "text": "¿Por qué cada día siento más amor dentro de mí y a mi alrededor?" },
    { "text": "¿Por qué mi corazón está lleno de amor y gratitud?" },
    { "text": "¿Por qué el amor que doy y recibo me hace sentir pleno y feliz?" },
    { "text": "¿Por qué el amor perfecto llega a mi vida en el momento adecuado?" },
    { "text": "¿Por qué mi relación ideal se manifiesta con facilidad y alegría?" },
    { "text": "¿Por qué el amor verdadero me encuentra sin esfuerzo?" },
    { "text": "¿Por qué siempre estoy rodeado de amor puro y sincero?" },
    { "text": "¿Por qué cada día mi capacidad de amar se expande y fortalece?" },
    { "text": "¿Por qué mi vida está llena de conexiones amorosas y significativas?" },
    { "text": "¿Por qué el amor en mi vida es una fuente inagotable de felicidad?" },
    { "text": "¿Por qué cada experiencia amorosa me enseña y me fortalece?" },
    { "text": "¿Por qué el amor me encuentra en los lugares más inesperados?" },
    { "text": "¿Por qué el amor que recibo siempre es sincero y profundo?" },
    { "text": "¿Por qué merezco un amor que me haga sentir seguro y valorado?" },
    { "text": "¿Por qué atraigo relaciones amorosas llenas de respeto y alegría?" },
    { "text": "¿Por qué el amor que deseo ya está en camino hacia mí?" },
    { "text": "¿Por qué me permito vivir el amor plenamente?" },
    { "text": "¿Por qué cada día es una oportunidad para dar y recibir amor?" },
    { "text": "¿Por qué mi vida amorosa es armoniosa y satisfactoria?" },
    { "text": "¿Por qué el amor que tengo es suficiente y perfecto para mí?" },
    { "text": "¿Por qué siempre encuentro amor en los momentos más inesperados?" },
    { "text": "¿Por qué mi corazón está abierto para recibir amor en abundancia?" },
    { "text": "¿Por qué el amor en mi vida es duradero y sincero?" },
    { "text": "¿Por qué merezco un amor sano, feliz y lleno de magia?" },
    { "text": "¿Por qué las relaciones amorosas en mi vida son cada día más fuertes?" },
    { "text": "¿Por qué siempre soy tratado con amor y ternura?" },
    { "text": "¿Por qué el amor que busco también me está buscando a mí?" },
    { "text": "¿Por qué el amor es una constante en mi vida?" },
    { "text": "¿Por qué mi pareja ideal ya está en camino hacia mí?" },
    { "text": "¿Por qué el amor que recibo refleja el amor que tengo por mí mismo?" },
    { "text": "¿Por qué el amor fluye hacia mí con facilidad y sin esfuerzo?" },
    { "text": "¿Por qué cada día aprendo a amar de manera más profunda y sincera?" },
    { "text": "¿Por qué el amor llena mi vida de luz y felicidad?" },
    { "text": "¿Por qué mi vida amorosa está llena de momentos mágicos y especiales?" },
    { "text": "¿Por qué soy una persona digna de amor en todas sus formas?" },
    { "text": "¿Por qué cada relación en mi vida me aporta amor y aprendizaje?" },
    { "text": "¿Por qué el amor se manifiesta en cada aspecto de mi vida?" },
    { "text": "¿Por qué la persona perfecta para mí también me está buscando?" },
    { "text": "¿Por qué el amor verdadero me rodea siempre?" },
    { "text": "¿Por qué doy y recibo amor sin miedo ni límites?" },
    { "text": "¿Por qué el amor en mi vida es cada vez más profundo y real?" },
    { "text": "¿Por qué merezco un amor que me haga crecer y evolucionar?" },
    { "text": "¿Por qué cada día el amor en mi vida se multiplica?" },
    { "text": "¿Por qué el amor que siento me llena de paz y plenitud?" },
    { "text": "¿Por qué todas mis relaciones amorosas son armoniosas y felices?" },
    { "text": "¿Por qué estoy en sintonía con el amor que merezco?" },
    { "text": "¿Por qué mi corazón está listo para recibir un amor sincero y puro?" },
    { "text": "¿Por qué el amor es una energía constante en mi vida?" },
    { "text": "¿Por qué cada día atraigo más amor, ternura y felicidad?" }
],
  SALUD: [
    { "text": "¿Por qué mi cuerpo se fortalece y se regenera cada día?" },
    { "text": "¿Por qué disfruto de una salud vibrante y llena de energía?" },
    { "text": "¿Por qué mi bienestar físico y mental mejora constantemente?" },
    { "text": "¿Por qué cada célula de mi cuerpo está llena de vitalidad?" },
    { "text": "¿Por qué me siento más fuerte, saludable y en equilibrio cada día?" },
    { "text": "¿Por qué mi sistema inmunológico me protege con eficacia?" },
    { "text": "¿Por qué cada día mi cuerpo y mi mente trabajan en armonía?" },
    { "text": "¿Por qué mi alimentación y hábitos fortalecen mi salud?" },
    { "text": "¿Por qué disfruto mover mi cuerpo y mantenerme activo?" },
    { "text": "¿Por qué la salud fluye en cada parte de mi ser?" },
    { "text": "¿Por qué cada respiración me llena de energía y bienestar?" },
    { "text": "¿Por qué descanso profundamente y me despierto renovado?" },
    { "text": "¿Por qué mi cuerpo sabe exactamente cómo sanar y equilibrarse?" },
    { "text": "¿Por qué cada día me siento más joven y vital?" },
    { "text": "¿Por qué la salud y la felicidad son mi estado natural?" },
    { "text": "¿Por qué mi mente y mi cuerpo están en perfecta armonía?" },
    { "text": "¿Por qué cada día me lleno de energía y vitalidad?" },
    { "text": "¿Por qué mi digestión es saludable y eficiente?" },
    { "text": "¿Por qué mi piel brilla con salud y bienestar?" },
    { "text": "¿Por qué mi corazón late con fuerza y salud perfecta?" },
    { "text": "¿Por qué mis músculos y articulaciones están llenos de fuerza y flexibilidad?" },
    { "text": "¿Por qué mi cuerpo me agradece cada elección saludable que tomo?" },
    { "text": "¿Por qué disfruto cuidar mi bienestar físico, mental y emocional?" },
    { "text": "¿Por qué cada día me siento más en paz y en equilibrio?" },
    { "text": "¿Por qué la salud perfecta es mi estado natural?" },
    { "text": "¿Por qué mi sistema nervioso está tranquilo y en equilibrio?" },
    { "text": "¿Por qué mi metabolismo funciona de manera óptima?" },
    { "text": "¿Por qué cada día mi cuerpo se renueva y se llena de energía?" },
    { "text": "¿Por qué la vida me llena de salud y bienestar?" },
    { "text": "¿Por qué tengo una increíble capacidad para sanar y renovarme?" },
    { "text": "¿Por qué el ejercicio me llena de alegría y vitalidad?" },
    { "text": "¿Por qué cada célula de mi cuerpo está en equilibrio y armonía?" },
    { "text": "¿Por qué mi salud mejora con cada pensamiento positivo que tengo?" },
    { "text": "¿Por qué mi cuerpo responde con gratitud a mis cuidados?" },
    { "text": "¿Por qué disfruto el proceso de fortalecer mi salud y bienestar?" },
    { "text": "¿Por qué mi cuerpo está lleno de energía y libre de malestar?" },
    { "text": "¿Por qué siempre tengo la energía suficiente para todo lo que quiero hacer?" },
    { "text": "¿Por qué mi salud física y mental se alinean con mi bienestar?" },
    { "text": "¿Por qué mis pensamientos positivos refuerzan mi salud?" },
    { "text": "¿Por qué disfruto de cada comida saludable que nutre mi cuerpo?" },
    { "text": "¿Por qué cada noche descanso profundamente y me despierto renovado?" },
    { "text": "¿Por qué mis hábitos diarios me acercan cada vez más a una vida saludable?" },
    { "text": "¿Por qué mi sistema inmune es fuerte y me protege con facilidad?" },
    { "text": "¿Por qué cada actividad que realizo fortalece mi bienestar?" },
    { "text": "¿Por qué tengo una salud óptima en todas las áreas de mi vida?" },
    { "text": "¿Por qué cada día descubro nuevas formas de mejorar mi salud?" },
    { "text": "¿Por qué mi cuerpo me guía intuitivamente hacia hábitos saludables?" },
    { "text": "¿Por qué la gratitud que siento refuerza mi salud y bienestar?" },
    { "text": "¿Por qué mi vida está llena de energía, equilibrio y bienestar?" },
    { "text": "¿Por qué cada día mi cuerpo y mi mente se sienten mejor y más fuertes?" }
],

  FELICIDAD: [
    { "text": "¿Por qué cada día me siento más feliz y pleno?" },
    { "text": "¿Por qué la felicidad es una constante en mi vida?" },
    { "text": "¿Por qué siempre encuentro motivos para estar agradecido y feliz?" },
    { "text": "¿Por qué la alegría y el bienestar fluyen fácilmente hacia mí?" },
    { "text": "¿Por qué cada momento de mi vida está lleno de luz y positividad?" },
    { "text": "¿Por qué siempre tengo razones para reír y disfrutar?" },
    { "text": "¿Por qué la felicidad se manifiesta en cada aspecto de mi vida?" },
    { "text": "¿Por qué mi corazón está lleno de gratitud y amor?" },
    { "text": "¿Por qué cada día es una nueva oportunidad para disfrutar la vida?" },
    { "text": "¿Por qué mi mente está llena de pensamientos positivos y felices?" },
    { "text": "¿Por qué la felicidad viene a mí de manera natural y sin esfuerzo?" },
    { "text": "¿Por qué me rodeo de personas que me llenan de alegría?" },
    { "text": "¿Por qué disfruto cada experiencia con entusiasmo y gratitud?" },
    { "text": "¿Por qué mi vida está llena de momentos felices y gratificantes?" },
    { "text": "¿Por qué la alegría es mi estado natural?" },
    { "text": "¿Por qué cada día me acerco más a mis sueños y metas?" },
    { "text": "¿Por qué mi vida está llena de amor, paz y felicidad?" },
    { "text": "¿Por qué me permito disfrutar cada instante con plenitud?" },
    { "text": "¿Por qué el universo siempre me brinda razones para ser feliz?" },
    { "text": "¿Por qué mi actitud positiva me abre puertas a nuevas oportunidades?" },
    { "text": "¿Por qué mi felicidad no depende de las circunstancias externas?" },
    { "text": "¿Por qué siempre tengo una sonrisa en mi rostro?" },
    { "text": "¿Por qué la felicidad está en los pequeños detalles de mi vida?" },
    { "text": "¿Por qué disfruto el presente sin preocuparme por el futuro?" },
    { "text": "¿Por qué cada día descubro nuevas razones para sentirme afortunado?" },
    { "text": "¿Por qué mi bienestar emocional crece con cada experiencia?" },
    { "text": "¿Por qué la vida me sorprende con momentos de pura alegría?" },
    { "text": "¿Por qué la felicidad que siento es contagiosa para los demás?" },
    { "text": "¿Por qué mi paz interior me permite disfrutar la vida al máximo?" },
    { "text": "¿Por qué cada día es una bendición llena de felicidad?" },
    { "text": "¿Por qué mi energía positiva atrae más alegría a mi vida?" },
    { "text": "¿Por qué encuentro belleza en cada instante de mi día?" },
    { "text": "¿Por qué soy capaz de transformar cualquier situación en una oportunidad para crecer?" },
    { "text": "¿Por qué la felicidad es mi elección en cada momento?" },
    { "text": "¿Por qué todo lo que hago me acerca a una vida más plena y feliz?" },
    { "text": "¿Por qué siempre veo lo mejor en cada situación?" },
    { "text": "¿Por qué cada paso que doy me llena de satisfacción y alegría?" },
    { "text": "¿Por qué disfruto de una vida plena y llena de propósito?" },
    { "text": "¿Por qué la felicidad me acompaña en cada camino que tomo?" },
    { "text": "¿Por qué me permito ser feliz sin límites ni condiciones?" },
    { "text": "¿Por qué cada día despierto con gratitud y entusiasmo?" },
    { "text": "¿Por qué mi vida está llena de momentos mágicos y especiales?" },
    { "text": "¿Por qué tengo el poder de crear mi propia felicidad?" },
    { "text": "¿Por qué la paz y la felicidad van siempre de la mano en mi vida?" },
    { "text": "¿Por qué todo lo que necesito para ser feliz ya está dentro de mí?" },
    { "text": "¿Por qué mi felicidad se expande y toca la vida de los demás?" },
    { "text": "¿Por qué mi corazón está abierto a recibir toda la alegría del mundo?" },
    { "text": "¿Por qué la felicidad es mi compañero constante?" },
    { "text": "¿Por qué cada día es una nueva oportunidad para ser feliz?" },
    { "text": "¿Por qué la felicidad que siento es infinita y genuina?" }
],

  DINERO: [
    { "text": "¿Por qué el dinero llega a mí en abundancia y con facilidad?" },
    { "text": "¿Por qué siempre tengo más que suficiente para cubrir mis necesidades y deseos?" },
    { "text": "¿Por qué cada día mi riqueza y estabilidad financiera aumentan?" },
    { "text": "¿Por qué la abundancia es mi estado natural y la acepto con gratitud?" },
    { "text": "¿Por qué el universo siempre me provee de dinero en el momento perfecto?" },
    { "text": "¿Por qué mis ingresos crecen constantemente y sin esfuerzo?" },
    { "text": "¿Por qué las oportunidades financieras llegan a mí sin dificultad?" },
    { "text": "¿Por qué el dinero circula en mi vida de manera armoniosa y equilibrada?" },
    { "text": "¿Por qué disfruto de una relación sana y positiva con el dinero?" },
    { "text": "¿Por qué cada inversión que hago me trae grandes recompensas?" },
    { "text": "¿Por qué mi mentalidad de abundancia atrae riqueza sin límites?" },
    { "text": "¿Por qué el dinero fluye hacia mí desde múltiples fuentes?" },
    { "text": "¿Por qué la prosperidad es una constante en mi vida?" },
    { "text": "¿Por qué cada día recibo más ingresos de formas inesperadas?" },
    { "text": "¿Por qué siempre encuentro nuevas maneras de generar riqueza?" },
    { "text": "¿Por qué el dinero que gasto regresa a mí multiplicado?" },
    { "text": "¿Por qué mi trabajo y pasión me brindan abundancia y estabilidad financiera?" },
    { "text": "¿Por qué me siento merecedor de toda la riqueza que el universo tiene para ofrecerme?" },
    { "text": "¿Por qué mis habilidades y talentos me llevan a la prosperidad?" },
    { "text": "¿Por qué la riqueza y la felicidad van de la mano en mi vida?" },
    { "text": "¿Por qué cada día aprendo más sobre cómo administrar y multiplicar mi dinero?" },
    { "text": "¿Por qué siempre tengo dinero para todo lo que necesito y deseo?" },
    { "text": "¿Por qué las oportunidades económicas correctas aparecen en mi camino?" },
    { "text": "¿Por qué mi cuenta bancaria crece constantemente?" },
    { "text": "¿Por qué tengo una mentalidad próspera y de éxito financiero?" },
    { "text": "¿Por qué me rodeo de personas que me inspiran a ser financieramente exitoso?" },
    { "text": "¿Por qué mis decisiones financieras siempre son acertadas?" },
    { "text": "¿Por qué disfruto administrar mi dinero con sabiduría?" },
    { "text": "¿Por qué mi riqueza crece sin esfuerzo y con facilidad?" },
    { "text": "¿Por qué el dinero siempre encuentra su camino hacia mí?" },
    { "text": "¿Por qué me siento en paz y seguro con mi situación financiera?" },
    { "text": "¿Por qué soy un canal abierto para la prosperidad infinita?" },
    { "text": "¿Por qué todas mis acciones están alineadas con la abundancia?" },
    { "text": "¿Por qué siempre tengo dinero extra para disfrutar la vida?" },
    { "text": "¿Por qué soy libre financieramente y disfruto de mi riqueza?" },
    { "text": "¿Por qué cada decisión financiera que tomo mejora mi futuro?" },
    { "text": "¿Por qué siempre recibo más dinero del que gasto?" },
    { "text": "¿Por qué mis ingresos pasivos aumentan constantemente?" },
    { "text": "¿Por qué la abundancia económica es parte de mi realidad diaria?" },
    { "text": "¿Por qué el dinero me permite vivir la vida que deseo?" },
    { "text": "¿Por qué mi actitud positiva atrae éxito y riqueza?" },
    { "text": "¿Por qué las oportunidades de negocio y crecimiento financiero me buscan?" },
    { "text": "¿Por qué todo lo que toco se convierte en éxito y abundancia?" },
    { "text": "¿Por qué estoy rodeado de oportunidades económicas prósperas?" },
    { "text": "¿Por qué el dinero es una herramienta que mejora mi vida y la de los demás?" },
    { "text": "¿Por qué confío plenamente en mi capacidad para atraer riqueza?" },
    { "text": "¿Por qué cada paso que doy me acerca más a la libertad financiera?" },
    { "text": "¿Por qué la prosperidad y la abundancia son mi derecho natural?" },
    { "text": "¿Por qué el dinero me llega en cantidades inesperadas y maravillosas?" },
    { "text": "¿Por qué mi vida está llena de bendiciones económicas?" }
],

  RELACIONES: [
    { "text": "¿Por qué mis relaciones están llenas de amor y comprensión?" },
    { "text": "¿Por qué atraigo personas que me valoran y respetan?" },
    { "text": "¿Por qué mis relaciones se fortalecen con cada día que pasa?" },
    { "text": "¿Por qué soy digno de amor y afecto en todas mis relaciones?" },
    { "text": "¿Por qué disfruto de relaciones saludables y equilibradas?" },
    { "text": "¿Por qué la comunicación en mis relaciones es clara y amorosa?" },
    { "text": "¿Por qué mis vínculos con los demás se basan en la confianza y el respeto?" },
    { "text": "¿Por qué el amor y la felicidad fluyen libremente en mis relaciones?" },
    { "text": "¿Por qué las personas en mi vida me apoyan y me inspiran?" },
    { "text": "¿Por qué siempre estoy rodeado de amor y energía positiva?" },
    { "text": "¿Por qué doy y recibo amor de manera natural y sincera?" },
    { "text": "¿Por qué mis relaciones románticas están llenas de pasión y compromiso?" },
    { "text": "¿Por qué mi pareja y yo crecemos juntos en amor y armonía?" },
    { "text": "¿Por qué mis relaciones familiares son amorosas y fortalecedoras?" },
    { "text": "¿Por qué atraigo amistades genuinas y enriquecedoras?" },
    { "text": "¿Por qué cada relación en mi vida me enseña y me hace mejor persona?" },
    { "text": "¿Por qué mis seres queridos me aceptan tal como soy?" },
    { "text": "¿Por qué expreso mis sentimientos con honestidad y amor?" },
    { "text": "¿Por qué el amor en mi vida se expande y crece cada día?" },
    { "text": "¿Por qué mis relaciones son estables y armoniosas?" },
    { "text": "¿Por qué siempre atraigo relaciones llenas de amor y reciprocidad?" },
    { "text": "¿Por qué me rodeo de personas que me hacen sentir amado y valorado?" },
    { "text": "¿Por qué mi vida está llena de conexiones profundas y significativas?" },
    { "text": "¿Por qué la felicidad y la paz son la base de todas mis relaciones?" },
    { "text": "¿Por qué todas mis relaciones están llenas de respeto y empatía?" },
    { "text": "¿Por qué siempre encuentro personas con las que conecto de forma auténtica?" },
    { "text": "¿Por qué disfruto de relaciones enriquecedoras y duraderas?" },
    { "text": "¿Por qué me permito recibir amor en la misma medida en que lo doy?" },
    { "text": "¿Por qué todas mis relaciones están alineadas con mi felicidad?" },
    { "text": "¿Por qué mi corazón está abierto a recibir y dar amor incondicional?" },
    { "text": "¿Por qué tengo la capacidad de mejorar y sanar mis relaciones?" },
    { "text": "¿Por qué el amor verdadero está presente en mi vida en todas sus formas?" },
    { "text": "¿Por qué me permito ser auténtico en todas mis relaciones?" },
    { "text": "¿Por qué las personas que entran en mi vida me aportan felicidad y bienestar?" },
    { "text": "¿Por qué mis relaciones están llenas de alegría y momentos inolvidables?" },
    { "text": "¿Por qué siempre encuentro tiempo para nutrir mis relaciones importantes?" },
    { "text": "¿Por qué merezco amor, respeto y compañía en mi vida?" },
    { "text": "¿Por qué cada interacción que tengo fortalece mis lazos emocionales?" },
    { "text": "¿Por qué mis relaciones se basan en la confianza mutua?" },
    { "text": "¿Por qué siempre encuentro personas que me complementan y me apoyan?" },
    { "text": "¿Por qué disfruto de una conexión profunda con mi pareja?" },
    { "text": "¿Por qué mis relaciones son fuentes de amor, aprendizaje y crecimiento?" },
    { "text": "¿Por qué el amor que doy regresa a mí multiplicado?" },
    { "text": "¿Por qué cada día mejoro mi capacidad de amar y ser amado?" },
    { "text": "¿Por qué mis relaciones están llenas de gratitud y felicidad?" },
    { "text": "¿Por qué me rodeo de personas que enriquecen mi vida con su amor y amistad?" },
    { "text": "¿Por qué mi vida amorosa es satisfactoria y plena?" },
    { "text": "¿Por qué siempre tengo la claridad para elegir relaciones que me benefician?" },
    { "text": "¿Por qué mi vida está llena de amor en todas sus formas y expresiones?" }
],

} as const;

// Función para generar colores aesthetic
const getRandomColorPair = () => {
  const hue = Math.floor(Math.random() * 360); // Rango completo de tonos
  const variations = [
    { bg: [85, 95], text: [25, 35] },   // Pastel claro + oscuro
    { bg: [20, 30], text: [85, 95] },   // Oscuro + pastel claro
    { bg: [90, 95], text: [40, 50] },   // Blanco roto + colores terrosos
    { bg: [95, 98], text: [20, 30] },   // Casi blanco + tono oscuro
    { bg: [80, 90], text: [30, 40] },   // Pastel medio + tono medio
  ];

  const variation = variations[Math.floor(Math.random() * variations.length)];

  return {
    bgColor: `hsla(
      ${hue},
      ${30 + Math.floor(Math.random() * 20)}%,
      ${variation.bg[0] + Math.floor(Math.random() * (variation.bg[1] - variation.bg[0]))}%,
      0.97
    )`,
    textColor: `hsl(
      ${hue + (Math.random() > 0.5 ? 180 : 0)},
      ${60 + Math.floor(Math.random() * 30)}%,
      ${variation.text[0] + Math.floor(Math.random() * (variation.text[1] - variation.text[0]))}%
    )`
  };
};

type PhraseText = typeof phrases[keyof typeof phrases][number]['text'];

const App: React.FC = () => {
  const [category, setCategory] = useState<Category>("ORDEN");
  const [currentPhrase, setCurrentPhrase] = useState<PhraseText>(phrases[category][0].text);
  const [colors, setColors] = useState(getRandomColorPair());

  useEffect(() => {
    scheduleNotifications();
  }, []);

  // Función para actualizar colores
  const updateColors = () => {
    setColors(getRandomColorPair());
  };

  const changePhrase = () => {
    const categoryPhrases = phrases[category];
    const newPhrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)].text as PhraseText;
    setCurrentPhrase(newPhrase);
    updateColors();
  };

  // Actualizar colores al cambiar categoría
  useEffect(() => {
    const categoryPhrases = phrases[category];
    const newPhrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)].text as PhraseText;
    setCurrentPhrase(newPhrase);
    updateColors();
  }, [category]);

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center" style={{
              color: 'lightgray',
              marginTop: '30px',
            }}> MIS AFIRMACIONES</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent:'center', allignItems:'center' ,height: '100vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Selector de categoría */}
            <IonSelect
              value={category}
              onIonChange={(e) => setCategory(e.detail.value as Category)}
              interface="popover"
              style={{
                margin: '20px auto',
                maxWidth: '300px',
                backgroundColor: 'white',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              {(Object.keys(phrases) as Category[]).map((cat) => (
                <IonSelectOption key={cat} value={cat} style={{ textAlign: 'center' }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>

            {/* Tarjeta de frase */}
            <div style={{
              minHeight: '300px',
              margin: '20px',
              padding: '25px',
              backgroundColor: colors.bgColor,
              borderRadius: '20px',
              boxShadow: `0 8px 32px ${colors.textColor}20`,
              transition: 'all 0.6s ease',
              backdropFilter: 'blur(4px)',
              border: `1px solid ${colors.textColor}20`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center' // Asegura que el texto se centre horizontalmente
            }}>
              <h1 style={{
                fontSize: '2rem',
                lineHeight: '1.4',
                color: colors.textColor,
                margin: 0,
                fontWeight: 600,
                transition: 'all 0.6s ease',
                fontFamily: 'system-ui',
                textShadow: `0 2px 4px ${colors.textColor}10`
              }}>
                {currentPhrase.toUpperCase()}
              </h1>
            </div>

            {/* Botón de actualización */}
            <IonButton
              expand="block"
              onClick={changePhrase}
              style={{
                maxWidth: '300px',
                margin: '0px auto',
                padding: '10px',
                fontSize: '1.1rem',
              }}
            >
              <MdRefresh style={{ marginRight: '0px', fontSize: '1.5rem' }} />
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </IonApp>);
};

const scheduleNotifications = async () => {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  await LocalNotifications.schedule({
    notifications: [{
      id: 1,
      title: " Holi 💡",
      body: ":) " + phrases["ORDEN"][0].text,
      schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 6), repeats: true, every: 'hour', count: 6 },
    }],
  });
};

export default App;
