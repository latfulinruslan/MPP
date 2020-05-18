import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import { Select } from 'react-materialize'

class Notes extends React.Component {
    _isMounted = false;
    state = {
        notes: null,
        displayedNotes: null
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.socket === null) {
            this.props.history.push('/authentification/1');
        } else {
            this.props.socket.on('notes', (data) => {
                if (this._isMounted)
                    this.setState({
                        notes: data,
                        displayedNotes: data
                    })
            })

            this.props.socket.emit('get all notes');
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleCompleteCheckbox = (e) => {
        this.props.socket.emit('change note status', e.target.id, e.target.checked);
    }

    handleSelectChange = (e) => {
        if (this._isMounted)
        switch (e.target.value) {
            case '1':
                this.setState({
                    displayedNotes: this.state.notes.filter(note => new Date(note.date) <= new Date())
                })
                break;
            case '2':
                this.setState({
                    displayedNotes: this.state.notes.filter(note => new Date(note.date) > new Date())
                })
                break;
            case '3':
                this.setState({
                    displayedNotes: this.state.notes.filter(note => note.complete)
                })
                break;
            case '4':
                this.setState({
                    displayedNotes: this.state.notes.filter(note => note.date === '')
                })
                break;
            default:
                this.setState({
                    displayedNotes: [...this.state.notes]
                })
                break;
        }
    }

    createNotes() {
        return (
            this.state.displayedNotes.map(note => { return (
                <div className="card hoverable" key={ note.id }>                        
                    <div className="changeCursor card-content" onClick={ () => this.props.history.push('details/' + note.id) }>
                        <span className="card-title center">{ note.title }</span>
                        <pre>{ note.content }</pre>
                    </div>

                    <div className="card-action row valign-wrapper">
                        <div className="col s3 left-align">
                            <form>     
                                <label>
                                    <input id={note.id} type="checkbox" defaultChecked={note.complete} className="complete-checkbox" onClick={ this.handleCompleteCheckbox }/>
                                    <span>Complete</span>
                                </label>
                            </form>
                        </div>

                        <div className="col s6 center-align">
                            <p>{ note.date }</p>
                        </div>

                        <div className="col s3 right-align">
                            <Link to={ 'edit/' + note.id } className="btn-floating red">
                                <i className="material-icons">edit</i>
                            </Link>
                        </div>
                    </div>
                </div>
            )})
        )
    }

    createAdditionalElements() {
        return (
            <div className="additionals">
                <div className="fixed-action-btn">
                    <Link to={ 'add/-1' } className="btn-floating red">
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </div>
        )
    }

    render() {
        let content = null;

        if (this.state.notes === null) { 
            content = <Loading />;
        } else if (this.state.notes === []) {
            content = <h2>There are no notes to display!</h2>;
        } else {
            content = (
                <div>
                    { this.createAdditionalElements() }
                    { this.createNotes() }
                </div>
            )
        }

        return (
            <div className="notes container">
                { content }
            </div>
        )
    }
}

export default Notes