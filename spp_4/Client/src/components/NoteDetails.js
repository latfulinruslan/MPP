import React from 'react';
import Loading from './Loading';

class NoteDetails extends React.Component {
    _isMounted = false;
    state = {
        note: null
    }

    handleCompleteCheckbox = (e) => {
        this.props.socket.emit('change note status', e.target.id, e.target.checked);
    }

    handleDelete = (e) => {
        this.props.socket.on('deleted', (data) => {
            this.props.history.push('/');
        });

        this.props.socket.emit('delete note', this.state.note.id);
    }

    componentDidMount() {
        this._isMounted = true;
        const id = this.props.match.params.note_id;

        if (this.props.socket) {
            this.props.socket.on('note', (data) => {
                if (this._isMounted) {
                    this.setState({
                        note: data
                    });
                }
            })

            this.props.socket.emit('get note', id);
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