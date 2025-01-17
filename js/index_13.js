/* JOINDRE LES DONNEES DE PAYS
PASSAGE AUX PROMISES */

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

Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
]).then(([tsv_data,json_data])=>{
    const noms_pays = {};
    //>> extraire les noms et les mapper
    tsv_data.forEach(d => {
        //!! iso 3 est la norme de pays
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
            //>> ajout de chaque nom
            .text(d => noms_pays[d.id])
});
