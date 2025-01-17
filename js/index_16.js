/* CREER UN CODE DE PAYS A PARTIR DE SURVEY */

// créer le canevas
const canevas = d3.select('body')
  .append('svg')
  .attr("viewBox", "0 0 960 600")
  .style("width", "100%")
  .style("height", "auto");
// choisir la pojection
const maProjection = d3.geoMercator();
// la passer en paramètre du
// générateur de chemins
const genererChemins = d3.geoPath()
    .projection(maProjection);
// dessiner les chemins
canevas.append('path')
  .attr('class','monde')
  .attr('d',genererChemins({type :'Sphere'}))

//>> créer une fonction pour convertir
//>> les codes questionnaies en pays
const convertir_en_pays = code_q => {
    switch(code_q){
        case 'SVA':
        case 'SCA':
            return 'Switzerland';
        case 'CQA':
        case 'CAA':
        case 'CQE':
            return 'Canada'; 
        case 'RCA': 
            return 'Central African Rep.';
        case 'CIA':
            return "Côte d'Ivoire";
        case '81A':
        case '13B':
        case '75C':
        case '61A':              
            return 'France';                   
    }
}

Promise.all([
    // Joindre les données topojson
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json'),
    // Joindre les données CSV
    d3.csv('donnees/donnees.csv', function(d){
        return {
            match : +d.Match[0],
            locuteur : d.Speaker,
            pays : convertir_en_pays(d.Survey),
            tache : d.Task           
          }
    })
    // Nommer les données CSV       
]).then(([tsv_data,json_data,donnees])=>{
    console.log(donnees[0].pays);
    // créer un objet pour les noms
    const noms_pays = {};
    // parcourir les données TSV
    tsv_data.forEach(d => {
        // créer des paires
        // id de pays : nom de pays
        noms_pays[d.iso_n3] = d.name;
    });
    const pays = topojson.feature(json_data,json_data.objects.countries);
    const chemins = canevas.selectAll('path')
        .data(pays.features)
        .enter()
        .append('path')
        .attr('class','pays')
        .attr('d',genererChemins)
        .attr('fill','purple')        
        // ajout du nom
        .append('title')
            // obtenir le nom de l'id
            // l'ajouter au contenu
            .text(d => noms_pays[d.id])
});
