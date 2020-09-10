import React, {Component} from 'react';
import api from '../api.js'
import {Button} from 'semantic-ui-react'


class PickImage extends Component {
    constructor() {
        super();
        this.state = {
            count:3

        }

    }

    unsplashGet = (e) => {
        e.preventDefault();
        api.getUnsplashMultiple(this.setSearchQuery(this.props.mood),this.state.count).then(
            imageResults => {

                console.log("returned imageResults:", imageResults.body);
                this.setState({ photoChoicesArray: imageResults.body })
            }
        )
    };
    unSplashRemove=()=>{
        this.setState({photoChoicesArray:null})
    };
    getUploadedFile = (e) => {
        const userFile=e.target.files[0];
        userFile.urls={regular:URL.createObjectURL(userFile),thumb:URL.createObjectURL(userFile)};
        userFile.userUploaded=true;
        console.log("we added local urls to the userFile:",userFile.urls);
        
        this.props.selectImage(userFile)
    };

    openUpload = () => {
        this.uploader.click()
    };

    
    setSearchQuery = (rating) => {
        let searchQuery =
            rating >= 9 ? "color" :
                rating >= 7 ? "horizon" :
                    rating >= 5 ? "calm" :
                        rating >= 3 ? 'rain' :
                            rating >= 0 ? "dark" : "walrus";
        return searchQuery;
    };

    

    render() {
        return (<div>
            <input
                ref={r => this.uploader = r}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={this.getUploadedFile}

            />
            {this.props.chosenPhoto ?
                <div style={{position:"relative"}}>
                <img
                    style={{
                        "maxWidth": "100%",
                        "maxHeight": "100%"
                    }}
                    src={this.props.chosenPhoto.urls.regular}
                    
                    alt={this.props.chosenPhoto.userUploaded ? "user uploaded photo":this.props.chosenPhoto.links.html} />
                   <Button onClick={this.props.deleteChosenPhoto}
                   style={{position:"absolute",bottom:10,right:10}}>X</Button>
                    </div>
                :

                this.state.photoChoicesArray ?

                    <div style={{ border: "2px dashed #d6d6d6", borderRadius: "25px", padding: '1rem 0'  }}>
                        {this.state.photoChoicesArray.map(
                            (photo, index) =>
                                <button key={index} style={{"maxHeight": "100%", border:'none', 'marginBottom': '1rem' }}
                                    onClick={() => this.props.selectImage(photo)}>
                                    <img style={{"maxHeight": "60%"}}
                                        src={photo.urls.thumb} alt={photo.links.html} />
                                </button>)}
                                <div>
                                <Button onClick={this.unsplashGet}>Search Again</Button>
                                <Button onClick={this.unSplashRemove}>Back</Button>
                                </div>
                                

                    </div>

                    :

                    <div style={{    
                        border: "2px dashed #d6d6d6",
                        borderRadius: "25px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: '1rem 0'
                    }}>
                        <Button onClick={this.unsplashGet}>Pick an Unsplash photo</Button>
                        <Button onClick={this.openUpload}>Upload Your Own Photo</Button>
                    </div>
            }


        </div>)
    }
}

export default PickImage;