import Certificate from "../components/certificate";

function GenerateCertificate() {
  return (
    <div>
        <Certificate
            data={{
            studentName: "Juan Rodrigo",
            studentApellido: "Loza Lazcano",
            courseName: "Desarrollo Web con React",
            duration: 120,
            deanName: "Lic. Andrea Quelali",
            deanTitle: "SEO de la Empresa mieee xd",
            vicePresidentName: "Sr. Adam Mamani", 
            vicePresidentTitle: "Gerente DevMente Company",
            location: "COCHABAMBA-BOLIVIA",
            backgroundImage: "https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg",
        }}
        />
    </div>
  )
}

export default GenerateCertificate;