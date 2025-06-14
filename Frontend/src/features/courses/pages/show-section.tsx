import CardShowSection from '../components/card-show-section';

const ShowSectionPage = () => {
  return (
    <div className="min-h-screen px-10">
      <CardShowSection
        title="Variables en Python"
        video="https://www.youtube.com/embed/kqtD5dpn9C8"
        text={`Las variables en Python son espacios nombrados en la memoria que se utilizan para almacenar datos que pueden cambiar durante la ejecución de un programa. Una variable actúa como una etiqueta que apunta a un valor específico, permitiendo al programador manipular ese valor fácilmente a lo largo del código. En Python, no es necesario declarar el tipo de variable de forma explícita, ya que el lenguaje es dinámicamente tipado, lo que significa que el tipo se determina automáticamente según el valor asignado.
          Para crear una variable, simplemente se elige un nombre válido (que debe comenzar con una letra o guion bajo y no puede contener espacios ni comenzar con números), y se le asigna un valor mediante el operador =.`}
        code={`# Declarar variables
nombre = "Ana"
edad = 25
print(f"Hola, soy {nombre} y tengo {edad} años.")`}
      />
    </div>
  );
};

export default ShowSectionPage;
