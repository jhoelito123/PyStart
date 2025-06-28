import Certificate from "../components/certificate";

function GenerateCertificate() {
  return (
    <div>
        <Certificate
            data={{
            studentName: "Juan Domingo",
            courseName: "Desarrollo Web con React",
            duration: 120,
            deanName: "Prof.(Dr.) María García",
            deanTitle: "Decana, MERI",
            vicePresidentName: "Prof. Carlos López", 
            vicePresidentTitle: "Vice Presidente, MERI",
            location: "COCHABAMBA-BOLIVIA",
            backgroundImage: "https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg",
        }}
        />
    </div>
  )
}

export default GenerateCertificate;