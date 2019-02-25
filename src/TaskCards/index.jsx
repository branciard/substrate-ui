import React from 'react';
import { ReactiveComponent, Rspan } from 'oo7-react';
const { Pretty } = require('../Pretty');
import { Card } from 'semantic-ui-react'
import { runtime, secretStore } from 'oo7-substrate';

import './TaskCards.css'

class TaskCard extends ReactiveComponent {
    constructor(props) {
        //super(['kitty', 'owner'])
        super(['task'])
    }

    readyRender() {
        let task = this.state.task;
        return (
            <div>
                <div>        
                TaskId :<Pretty value={task.id} />
                </div>
                <div>        
                Task consensus threshold :<Pretty value={task.threshold} />
                </div>
                <div>
                Task consensus :
                <Pretty value={runtime.iexec.tasksConsensus(task.id)}  />
                </div>  
                <div>
                Contributions Received :
                <Pretty value={runtime.iexec.contributionsCount(task.id)}  />
            </div>  

            ----------------------------------------------
        </div>);
       /* 
       
       
       
       return <Card>
                    <KittyAvatar dna={kitty.dna} />
                    <Card.Content>
                        <Card.Header><Pretty value={kitty.id} className="limit-name" /></Card.Header>
                        <Card.Meta>
                            <Pretty value={kitty.dna} className="limit-dna" />
                        </Card.Meta>
                        <Rspan>
                            <b>Owner</b>: {secretStore().find(this.state.owner).name}
                        </Rspan>
                        &nbsp;
                        <Identicon key={this.state.owner} account={this.state.owner} size={16}/>
                        <br />
                        <Rspan>
                            <b>Generation</b>: {kitty.gen}
                        </Rspan>
                        <br />
                    </Card.Content>
                    <Card.Content extra>
                        <Pretty value={kitty.price} prefix="$" />
                    </Card.Content>
                </Card>;*/
    }
}
/*
class TaskWrap extends ReactiveComponent {
    constructor(props) {
        super(['hash'])
    }

    readyRender() {
        // one level of indirection: convert a given hash
        // to the request of the actual kitty data and who it belongs to
        return <TaskCard
            task={runtime.iexec.tasks(this.state.hash)}
           // owner={runtime.substratekitties.kittyOwner(this.state.hash)}
        />
    }
}*/
class TaskWrap extends ReactiveComponent {
    constructor(props) {
        super(['hash'])
    }

    readyRender() {
        // one level of indirection: convert a given hash
        // to the request of the actual kitty data and who it belongs to
      return <TaskCard
        task={runtime.iexec.tasks(this.state.hash)}
    />
    }
}


export class TaskCards extends ReactiveComponent {
    constructor(props) {
        super(['count'])
    }
    unreadyRender() {
        return <span>No tasks found yet</span>
    }
    readyRender() {
        let tasks = [];
        for (var i=0; i < this.state.count; i++){
            tasks.push(
                <div className="column" key={i}>
                     <TaskWrap hash={runtime.iexec.allTasksArray(i)} />
                </div>
            );
        }
        
        return <div>{tasks}</div>;
    }
}
