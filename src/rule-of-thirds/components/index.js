import React from 'react';
import '../styles/main.scss';
// import fire from './fire';

const vision = require('react-cloud-vision-api');
vision.init({auth: 'AIzaSyAdJBBzi66kjNNwvPjCKcWBHpnR68IbIj8'});

class RuleOfThirds extends React.Component {

    constructor(props) {
    super(props);
    this.dimensions = React.createRef()
    this.state = {
        object : [],
        width: [],
        height: [],
        x1:[],
        y1: [],
        x2:[],
        y2: [],
        x3:[],
        y3: [],
        x4:[],
        y4: [],
        objectx: [],
        objecty: [],
        downloadvalue: [],
        viewvalue: [],
        imageProps: [],
        DistanceToPointA: [],
        DistanceToPointB: [],
        DistanceToPointC: [],
        DistanceToPointD: [],
    };
    }

    handleDownload = e => {
        this.setState({
            downloadvalue : e.target.value
        });
    }

    handleView = f => {
        this.setState({
            viewvalue : f.target.value
        });
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (()=> {
                resolve(fileReader.result);
            });
            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({base64: base64, imageProps: file});
        this.apiRequest();
    }

    apiRequest() {      
        const req = new vision.Request({
        image: new vision.Image({
            base64: this.state.base64,
        }),
        features: [new vision.Feature('OBJECT_LOCALIZATION', 1),]
        })

        vision.annotate(req)
        .then((res) => {
            var object = res.responses[0].localizedObjectAnnotations[0].boundingPoly.normalizedVertices;
            var x1object = object[0].x;
            var y1object = object[1].y;
            var x2object = object[1].x;
            var y2object = object[2].y;
            var objectx = (x2object + x1object)/2
            var objecty = (y2object + y1object )/2

            this.setState({
                objectx : objectx,
                objecty : objecty,
                })

            this.gridDot();
            this.setDistance();
            this.uploadToDataBase();

        }, (e) => {
        alert("foutje")
        });
    }

    gridDot() {
        this.setState({
            width: this.dimensions.current.offsetWidth, 
            height: this.dimensions.current.offsetHeight, 
            x1 : (this.dimensions.current.offsetWidth / 3)-9,
            y1 : (this.dimensions.current.offsetHeight / 3)-9,
            x2 : ((this.dimensions.current.offsetWidth / 3) * 2)-9,
            y2 : (this.dimensions.current.offsetHeight / 3)-9,
            x3 : (this.dimensions.current.offsetWidth / 3)-9,
            y3 : ((this.dimensions.current.offsetHeight / 3) * 2)-9,
            x4 : ((this.dimensions.current.offsetWidth / 3) * 2)-9,
            y4 : ((this.dimensions.current.offsetHeight / 3) * 2)-9,
        });
    }

    setDistance() {
        this.setState({
            DistanceToPointA :  Math.sqrt(Math.pow((this.state.objectx*this.state.width - this.state.x1), 2) + Math.pow((this.state.objecty*this.state.height - this.state.y1), 2)),
            DistanceToPointB :  Math.sqrt(Math.pow((this.state.objectx*this.state.width - this.state.x2), 2) + Math.pow((this.state.objecty*this.state.height - this.state.y2), 2)),
            DistanceToPointC :  Math.sqrt(Math.pow((this.state.objectx*this.state.width - this.state.x3), 2) + Math.pow((this.state.objecty*this.state.height - this.state.y3), 2)),
            DistanceToPointD :  Math.sqrt(Math.pow((this.state.objectx*this.state.width - this.state.x4), 2) + Math.pow((this.state.objecty*this.state.height - this.state.y4), 2)),
        })
    }

uploadToDataBase() {    
    // var name = this.state.imageProps.name.split('.').slice(0, -1).join('.');

    // fire.database().ref('Pictures/' +  name).update({
    //     Downloads: this.state.downloadvalue,
    //     Views: this.state.viewvalue,
    //     DistanceToPointA: this.state.DistanceToPointA,
    //     DistanceToPointB: this.state.DistanceToPointB,
    //     DistanceToPointC: this.state.DistanceToPointC,
    //     DistanceToPointD: this.state.DistanceToPointD,
    //     Height: this.state.height,
    //     Width: this.state.width,
    //   });
}

render() {
    
return (
<div className="rule-of-thirds">
    <div className="rule-of-thirds__image">
        <div className="rule-of-thirds__image__gridoverlay__item">
            <div className="rule-of-thirds__image__gridoverlay__item" style={{paddingLeft : this.state.x1, paddingTop: this.state.y1}}><div className="rule-of-thirds__image__gridoverlay__item__point"></div></div>
            <div className="rule-of-thirds__image__gridoverlay__item" style={{paddingLeft : this.state.x2, paddingTop: this.state.y2}}><div className="rule-of-thirds__image__gridoverlay__item__point"></div></div>
            <div className="rule-of-thirds__image__gridoverlay__item" style={{paddingLeft : this.state.x3, paddingTop: this.state.y3}}><div className="rule-of-thirds__image__gridoverlay__item__point"></div></div>
            <div className="rule-of-thirds__image__gridoverlay__item" style={{paddingLeft : this.state.x4, paddingTop: this.state.y4}}><div className="rule-of-thirds__image__gridoverlay__item__point"></div></div>
            <div className="rule-of-thirds__image__gridoverlay__item" style={{paddingLeft : this.state.objectx*this.state.width, paddingTop: this.state.objecty*this.state.height}}><div className="rule-of-thirds__image__gridoverlay__item__point">center object</div></div>
        </div>
        <img ref={this.dimensions} src={this.state.base64} />
    </div>
    <label for="fname">Aantal downloads:</label>
    <input type="text" onChange={this.handleDownload} id="downloads" name="fname"></input>
    <br />
    <label for="fname">Aantal keren bekeken:</label>
    <input type="text" onChange={this.handleView} id="views" name="fname"></input>
    <p>Breedte: {this.state.width}</p>
    <p>Hoogte: {this.state.height}</p>
    <p>Afstand tot Punt 1:  { this.state.DistanceToPointA} px</p>
    <p>Afstand tot Punt 2:  { this.state.DistanceToPointB} px</p>
    <p>Afstand tot Punt 3: { this.state.DistanceToPointC} px</p>
    <p>Afstand tot Punt 4:  { this.state.DistanceToPointD} px</p>
    <br />
    <button onClick={this.handleSubmit}>Save</button>
    <input className="filetest" type="file" onChange={(e)=> {
    this.uploadImage(e);
    }} />
</div>
)};

};

export default RuleOfThirds;