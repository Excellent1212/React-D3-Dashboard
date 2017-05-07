import React, { Component } from 'react';
import {Form, FormGroup, Button, ControlLabel, FormControl} from 'react-bootstrap'
import { connect } from 'react-redux'
import SqlForm from './SqlForm'
// import { Link } from 'react-router-dom';
import styles from '../../assets/TalkToDatabase.css';
const pg = require('pg')


class TalkToDatabase extends Component {
  constructor (props) {
    super (props)
    this.state = {
      currentDatabaseName: 'video-shopper',
      currentTableName: '',
      currentTablesArray: null
    }
    this.handleDatabaseChange = this.handleDatabaseChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    //this.handleFindTableSubmit = this.handleFindTableSubmit.bind(this)
    this.handleFindAllTables = this.handleFindAllTables.bind(this)
  }

  handleDatabaseChange (event) {
    this.setState({
      currentDatabaseName: event.target.value
    })
  }

  handleTableChange (event) {
    this.setState({
      currentTableName: event.target.value
    })
  }

  // handleClick(){
  // const client = new pg.Client('postgres://localhost/video-shopper')
  // client.connect()
  // client.query('SELECT * FROM product', function(err, data){
  //   if(err)console.log(err)
  //   else{
  //     window.TEMPDB = data.rows
  //   }
  // })
  // window.client = client
  // console.log(client)
  // }

  // handleFindTableSubmit(event) {
  //   event.preventDefault();
  //   const client = new pg.Client(`postgres://localhost/${this.state.currentDatabaseName}`)
  //   client.connect()
  //   client.query(`SELECT * FROM ${this.state.currentTableName}`, (err, data) => {
  //     if(err)console.log(err)
  //     else{
  //       // console.log(data.rows)
  //       this.props.setCurrentData(data.rows)
  //     }
  //   })
  //   window.client = client
  //   // console.log(client)
  // }


  handleFindAllTables(event) {
    event.preventDefault();
    const client = new pg.Client(`postgres://localhost/${this.state.currentDatabaseName}`)
    client.connect()
    client.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public'", (err, data) => {
      if(err)console.log(err)
      else{
      this.setState({
      currentTablesArray: data.rows
    })
      }
    })
    window.client = client
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h4>Talk To Database</h4>
          <Form onSubmit={ (event) => this.handleFindAllTables(event) } inline>
            <FormGroup controlId="formInlineName">
              <ControlLabel>Name of Database: </ControlLabel>
              <FormControl type="text" value={this.state.currentDatabaseName} onChange={event => this.handleDatabaseChange(event)} />
              <p />
              {/*<ControlLabel>Name of Table: </ControlLabel>
              <FormControl type="text" value={this.state.currentTableName} onChange={event => this.handleTableChange(event)} />*/}
            </FormGroup>
            <p />
            <Button type='submit'>
              Connect to Database
            </Button>
          </Form>
            { this.state.currentTablesArray &&
            this.state.currentTablesArray.map( x =>
              <li key={x.table_name}> { x.table_name } </li>)
            }
            {
              this.state.currentTablesArray &&
            <SqlForm />
            }
        </div>
      </div>
    );
  }
}

// ----------------------- Container -----------------------
import { setCurrentData } from '../reducers/dataReducer.jsx'

const mapStateToProps = (state, ownProps) => (
  {
    currentData: state.data.currentData
  }
)

const mapDispatchToProps = dispatch => ({
  setCurrentData: data => dispatch(setCurrentData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(TalkToDatabase)
