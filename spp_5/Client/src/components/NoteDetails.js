import React from 'react';
import Loading from './Loading';
import gql from "graphql-tag";
import Axios from 'axios';

class NoteDetails extends React.Component {
    _isMounted = false;
    state = {
        note: null
    }

    handleCompleteCheckbox = (e) => {
        this.props.client.mutate({
            mutation: gql`
                mutation checkNote($id: ID!, $status: Boolean!) {
                    completeNote(id: $id, status: $status)
                }
            `,
            variables: {
                "id": e.target.id,
                "status": e.target.checked
            },
        }).then(response => {if (!response.data.completeNote) { this.props.deleteUser(); this.props.history.push('/authentification/1'); }});
    }

    handleDelete = (e) => {
        this.props.client.mutate({
            mutation: gql`
                mutation delNote($id: ID!) {
                    deleteNote(id: $id)
                }
            `,
            variables: {
                "id": this.state.note.id
            },
        }).then(response => {this.props.history.push('/'); });
    }

    componentDidMount() {
        this._isMounted = true;
        const id = this.props.match.params.note_id;

        if (this.props.client) {
            Axios({
                url: 'http://localhost:5000/graphql',
                method: 'post',
                data: {
                    query: `{
                        getNote(id: ${id}) {
                            id
                            userId
                            title
                            content
                            date
                            complete
                        }
                    }`
                }
                }).then((result) => {
                    console.log(result)
                    this.setState({
                        note: result.data.data.getNote,})
                });
        } else {
            this.props.history.push('/authentification/1');
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const content = this.state.note ? (
        <div>
            <div className="note card">
                <div className="card-content">
                    <span className="card-title center">{ this.state.note.title }</span>
                    <blockquote>
                    <pre>{ this.state.note.content }</pre>
                    </blockquote>
                </div>
                <div className="card-action row valign-wrapper">
                    <div className="col s4 left-align">
                        <form>     
                            <label>
                                <input type="checkbox" id={ this.state.note.id } onClick={ this.handleCompleteCheckbox } defaultChecked={ this.state.note.complete } className="complete-checkbox"/>
                                <span>Complete</span>
                            </label>
                        </form>
                    </div>

                    <div className="col s4 center-align">
                        <p className="">{ this.state.note.date }</p>
                    </div>
                    <div className="col s4 right-align">
                        <button className="btn red darken-3 " onClick={ this.handleDelete }>
                            <i className="material-icons right">delete</i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
        ) : (
            <Loading />
        );

        return (
            <div className="container">
                { content }
            </div>
        )
    }
}

export default NoteDetails