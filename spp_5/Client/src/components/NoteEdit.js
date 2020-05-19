import React from 'react';
import Loading from './Loading'
import $ from "jquery";
import M from "materialize-css";
import DatePicker from "react-datepicker";
import gql from "graphql-tag";
import Axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";

class NoteEdit extends React.Component {
    _isMounted = false;
    state = {
        id: null,
        title: '',
        content: '',
        date: ''
    }

    componentDidMount() {  
        if (this.props.client === null) {
            this.props.history.push('/authentification/1');
        }

        this._isMounted = true;
        const id = this.props.match.params.note_id;
        
        if (id !== '-1') {
            if (this.props.client) {
                Axios({
                    url: 'http://localhost:5000/graphql',
                    method: 'post',
                    data: {
                        query: `{
                            getNote(id: ${id}) {
                                id
                                title
                                content
                                date
                            }
                        }`
                    }
                    }).then((result) => {
                        console.log(result)
                        this.setState({
                            id: result.data.data.getNote.id,
                            title: result.data.data.getNote.title,
                            content: result.data.data.getNote.content,
                            date: result.data.data.getNote.date,
                        });
    
                        M.textareaAutoResize($('#body_text'));
                        M.updateTextFields();
                    });
            } else {
                this.props.history.push('/authentification/1');
            }
        } else { 
            this.setState({
                note: { 
                    title: '',
                    content: '',
                    date: null
                }
            })
        }          

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSave = e => {
        let note = {
            userId: parseInt(localStorage.getItem('userId'), 10),
            title: this.state.title,
            content: this.state.content,
            date: this.state.date
        };

        if (this.state.id === null) {
            this.props.client.mutate({
                mutation: gql`
                    mutation addNewNote($info: NoteInput!) {
                        addNote(data: $info) {
                            id
                        }
                    }
                `,
                variables: {
                    "info": note
                },
            }).then(response => this.props.history.push('/details/' + response.data.addNote.id));

        } else {
            this.props.client.mutate({
                mutation: gql`
                    mutation updNote($id: ID!, $info: NoteInput!) {
                        updateNote(id: $id, data: $info) {
                            id
                        }
                    }
                `,
                variables: {
                    "id": this.state.id,
                    "info": note
                },
            }).then(response => this.props.history.push('/details/' + response.data.updateNote.id));
        }
    }

    handleTimlessClick = e => {
        let date = null;
        if (e.target.checked) {
            date = '';
        } else {
            date = new Date().toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        }
        this.setState({date: date});
    }

    handleDateChange = e => {
        let date = new Date(e).toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });      
        this.setState({ date: date });
    };

    handleTitleChange = e => {
        let title = e.target.value;    
        this.setState({ title: title });
    };

    handleContentChange = e => {
        let content = e.target.value;       
        this.setState({ content: content });    
    };

    render() {
        const { title, content, date } = this.state;
        const displayedCard = this.state.note !== null ? (
            <div className="note card">
                <div className="card-content">
                    <form>
                        <div className="input-field">
                            <i className="material-icons prefix">text_format</i>
                            <input id="title" type="text" className="validate" value={ title } onChange={ this.handleTitleChange }/>
                            <label htmlFor="title" className="active">Note's Title</label>
                        </div>

                        <div className="input-field">
                            <i className="material-icons prefix">mode_edit</i>
                            <textarea id="body_text" className="materialize-textarea" value={ content } onChange={ this.handleContentChange }/>
                            <label htmlFor="body_text" className="active">Note's content</label>
                        </div>
                        
                        <div className={date === '' ? 'input-field hide' : 'input-field'}>
                            <i className="material-icons prefix">date_range</i>
                            <label htmlFor="date" className="active">Note's date</label>
                            <DatePicker 
                                selected={ date !== '' ? new Date(date) : new Date() } 
                                onChange={this.handleDateChange} 
                                dateFormat="MMMM dd, yyyy"
                                className="datePicker" 
                            />
                        </div>
                    </form>
                </div>

                <div className="card-action row valign-wrapper">
                    <div className="col s4 left-align">
                        <button className="btn red darken-3" onClick={ this.handleSave }>
                            <i className="material-icons left">save</i>
                            Save
                        </button>
                    </div>
                    <form className="right-align col s8">     
                        <label>
                            <input type="checkbox" checked={ this.state.date === '' } onChange={ this.handleTimlessClick } className="complete-checkbox"/>
                            <span>Timeless</span>
                        </label>
                    </form>
                </div>
            </div>
        ) : (
            <Loading />
        )
       
        return (
            <div className="container">
                { displayedCard }
            </div>
        )
    }
}

export default NoteEdit