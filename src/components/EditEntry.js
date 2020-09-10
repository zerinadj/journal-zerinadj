import React, {Component} from 'react';
import api from '../api.js'
import auth from '../auth'
import {Button, Form, Grid, Header, Input} from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import PickImage from "./PickImage"
import firebase from 'firebase'


const config = {
    apiKey: "AIzaSyCzHkq5-09d9Uq9nUQgwg5jnuGoVFDzWUI",
    authDomain: "diary-b3439.firebaseapp.com",
    databaseURL: "https://diary-b3439.firebaseio.com",
    projectId: "diary-b3439",
    storageBucket: "diary-b3439.appspot.com",
    messagingSenderId: "471822866915"
};
// firebase.initializeApp(config);

const storage = firebase.storage()
const storageRef = storage.ref("")


class EditEntry extends Component {
    constructor() {
        super()
        this.state = {
            title: "",
            mood: "",
            q1a1: "",
            q1a2: "",
            q1a3: "",
            q2: "",
            q3: "",
            q4: "",
            lat: "",
            lng: "",
            id: '',
            place:"",
            special_question:"",
            chosenPhoto: {
                fromOriginalEntryToEdit: null,
                userUploaded: true,
                urls: {
                    regular: null
                }
            }

        }
    }

    componentDidMount() {
        console.log('editEntry', this.props.match.params.id);
        api.requestSingleEntry(this.props.match.params.id, auth.getToken())
            .then(reply => {
                console.log("response came back with the entry info. Let's edit:",reply.body);
                this.setState(
                    {

                        title: reply.body.title,
                        mood: reply.body.mood,
                        q1a1: reply.body.q1a1,
                        q1a2: reply.body.q1a2,
                        q1a3: reply.body.q1a3,
                        q2: reply.body.q2,
                        q3: reply.body.q3,
                        q4: reply.body.q4,
                        special_question:reply.body.special_question,
                        id: reply.body.id,
                        place:reply.body.place,
                        lat: reply.body.lat,
                        lng: reply.body.lng,
                        chosenPhoto: {
                            fromOriginalEntryToEdit: true,
                            userUploaded: true,
                            urls: {
                                regular: reply.body.full_image_url
                            }
                        }
                    }
                )
            })

    }

    moodChange = (e) => {
        this.setState({ mood: e.target.value })

    };
    selectImage = (photo) => {
        this.setState({
            chosenPhoto: photo
        })
    };
    deleteChosenPhoto = () => {
        this.setState({
            chosenPhoto: null
        })
    };
    handleKeyPress = (event) => {
        //provjerava je li korisnik pritisnuo enter i sprijecava submit forme ako jeste
        if (event.which === 13) {
            event.preventDefault()
        }
    };
    handleSubmit = (event) => {
        event.preventDefault();
        console.log("submitting form.");
        let entryPhoto = this.state.chosenPhoto;
        let entryDataObj = {
            title: this.state.title,
            mood: this.state.mood,
            q1a1: this.state.q1a1,
            q1a2: this.state.q1a2,
            q1a3: this.state.q1a3,
            q2: this.state.q2,
            q3: this.state.q3,
            q4: this.state.q4,
            special_question:this.state.special_question,
            place:this.state.place
        };

        // p1 i p2 provjeravaju je li korisnik promijenio adresu ili sliku (respektivno)
        //ako nije, bice postavljeni na null, da izbjegnemo nove API pozive ka Google ili firebase storage-u

        //p1 postavlja lat i lng na osnovu unosa korisnika
        //u EditEntry, desava se samo kad this.state.placeFormatted postoji,
        //a to ce se desiti samo ako korisnik izabere novo mjesto u inputu.

        const p1 = !!this.state.placeFormatted ? api.requestLatLong(this.state.placeFormatted)
            .then(object => {
                entryDataObj.lat = object.lat; entryDataObj.lng = object.lng
            }
            ) : null;

        //p2 ce provjeriti je li entryPhoto ista kao originalna, tj. da li je korisnik promijenio u toku editovanja

        const p2 = !entryPhoto.fromOriginalEntryToEdit ? (
            entryPhoto.userUploaded ? (
                console.log("User chose to upload photo. Uploadng to Firebase:", entryPhoto),
                this.setState({ loadingWrite: true }),
                storageRef.child(`user_uploaded_photos/${auth.getUser().user_id}/${this.state.title}/${entryPhoto.name}`)
                    .put(entryPhoto)
                    .then(snapshot => {
                        entryDataObj.full_image_url = snapshot.downloadURL;
                        entryDataObj.thumbnail_image_url = snapshot.downloadURL;
                    })) :
                //ako korisnik nije upload-ovao sliku, to je unSplash object

                (console.log("user chose an unSplash image, image urls are:", entryPhoto.urls),
                    entryDataObj.full_image_url = entryPhoto.urls.regular,
                    entryDataObj.thumbnail_image_url = entryPhoto.urls.thumb)
        ) : null;

        //ako se nije desila nikakva promjena, p1 i p2 ce biti null i Promise.app ce resolve-ati
        Promise.all([p1, p2])
            .then(() => {
                console.log("creating an entry with obj:", entryDataObj);
                api.editSingleEntry(entryDataObj, auth.getToken(),this.props.match.params.id).then(
                    results => console.log(results)
                )
            })
            .then(() => this.props.reloadEntries())
            .then(() => this.props.history.push(`/dashboard/readentry/${this.state.id}`))
    };

    render() {
        console.log('edit entry state ', this.state)
        return (
            <div className="write-entry">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 700 }}>
                        <PickImage mood={this.state.mood}
                            chosenPhoto={this.state.chosenPhoto}
                            selectImage={this.selectImage}
                            deleteChosenPhoto={this.deleteChosenPhoto}
                        />
                        <Header as="h2" textAlign="center">Edit your entry</Header>
                        <Form size="big" widths="equal" onKeyPress={this.handleKeyPress}>
                            <Form.Field>
                                <label>Give today a title</label>
                                <Input value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Rate your mood from 1-10</label>
                                <Input type='range' min="1" max="10" value={this.state.mood} onChange={this.moodChange} />
                                <p>{this.state.mood}</p>
                            </Form.Field>
                            <Form.Field >
                                <label>What are three highlights of today?</label>
                                <Input type="text" value={this.state.q1a1} onChange={(e) => this.setState({ q1a1: e.target.value })} />
                                <Input type="text" value={this.state.q1a2} onChange={(e) => this.setState({ q1a2: e.target.value })} />
                                <Input type="text" value={this.state.q1a3} onChange={(e) => this.setState({ q1a3: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>What could you have done to make today better?</label>
                                <Input type='text' value={this.state.q2} onChange={(e) => this.setState({ q2: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>{this.state.special_question}</label>
                                <Input type='text' value={this.state.q3} onChange={(e) => this.setState({ q3: e.target.value })} />
                            </Form.Field>
                            <Form.Field >
                                <label>Notes</label>
                                <Input type='text' value={this.state.q4} onChange={(e) => this.setState({ q4: e.target.value })} />
                            </Form.Field>
                            <Form.Field >
                                <label>Where did you go today?</label>
                                <Autocomplete placeholder={`${this.state.place}`}
                                    style={{ width: '90%' }} onPlaceSelected={(place) => {
                                        this.setState({
                                            //ako korisnik stavi novo mjesto, lat i lng postavlja se na null
                                            //onda se ti podaci uzimaju cim korisnik izabere novu adresu tj. mjesto/grad
                                            lat: null,
                                            lng: null,
                                            place:place.name,
                                            placeFormatted: place.formatted_address
                                        });
                                        console.log("we formatted the user submitted address to:", place.formatted_address);
                                    }}
                                    types={[]}
                                    componentRestrictions={{}}
                                />

                            </Form.Field>
                            <Button onClick={this.handleSubmit}>{this.state.loadingWrite ? 'Uploading...' : 'Submit Changes'}</Button>
                        </Form>


                    </Grid.Column>

                </Grid>

            </div>
        );
    }
}

export default EditEntry;
