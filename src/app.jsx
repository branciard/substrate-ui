import React from 'react';
require('semantic-ui-css/semantic.min.css');
const { generateMnemonic } = require('bip39')
import {Icon, List, Label, Header, Segment, Divider, Button} from 'semantic-ui-react';
import {Bond, TransformBond} from 'oo7';
import {ReactiveComponent, If, Rspan} from 'oo7-react';
import {calls, runtime, chain, system, runtimeUp, ss58Encode, addressBook, secretStore,addCodecTransform} from 'oo7-substrate';


import Identicon from 'polkadot-identicon';
import {AccountIdBond, SignerBond} from './AccountIdBond.jsx';
import {BalanceBond} from './BalanceBond.jsx';
import {InputBond} from './InputBond.jsx';
import {TransactButton} from './TransactButton.jsx';
import {FileUploadBond} from './FileUploadBond.jsx';
import {StakingStatusLabel} from './StakingStatusLabel';
import {WalletList, SecretItem} from './WalletList';
import {AddressBookList} from './AddressBookList';
import {TransformBondButton} from './TransformBondButton';
import {Pretty} from './Pretty';
import { TaskCards } from './TaskCards';


/*

/*
<SignerBond bond={this.skAccount}/>
<InputBond bond={this.assetName} placeholder='Kitty name' validator={n => stringToBytes(n) || null} />
<TransactButton
    content="Create Kitty"
    icon='paw'
    tx={{
        sender: runtime.indices.tryIndex(this.skAccount),
        call: calls.substratekitties.createKitty(this.assetName)
    }}
/>

*/



export class App extends ReactiveComponent {
	constructor () {
		super([], { ensureRuntime: runtimeUp })

		// For debug only.
		window.runtime = runtime;
		window.secretStore = secretStore;
		window.addressBook = addressBook;
		window.chain = chain;
		window.calls = calls;
		window.that = this;

		this.source = new Bond;
		this.amount = new Bond;
		this.destination = new Bond;
		this.nick = new Bond;
		this.lookup = new Bond;
		this.name = new Bond;
		this.seed = new Bond;
		this.seedAccount = this.seed.map(s => s ? secretStore().accountFromPhrase(s) : undefined)
		this.seedAccount.use()
		this.runtime = new Bond;
		this.accountCreateTask = new Bond;
		this.accountContribution = new Bond;
		this.contributionTaskId=new Bond;
		this.contribution=new Bond;
		this.contributionSeal=new Bond;
		this.accountReveal = new Bond;
		this.revealTaskId=new Bond;
		this.contributionUnseal=new Bond;


		addCodecTransform('Task<Hash>', {
			id: 'Hash',
			consensus: 'Hash'
		});
	}

	readyRender() {

		return (<div>
			<div>
				<Label>Name <Label.Detail>
					<Pretty className="value" value={system.name}/> v<Pretty className="value" value={system.version}/>
				</Label.Detail></Label>
				<Label>Chain <Label.Detail>
					<Pretty className="value" value={system.chain}/>
				</Label.Detail></Label>
				<Label>Runtime <Label.Detail>
					<Pretty className="value" value={runtime.version.specName}/> v<Pretty className="value" value={runtime.version.specVersion}/> (
						<Pretty className="value" value={runtime.version.implName}/> v<Pretty className="value" value={runtime.version.implVersion}/>
					)
				</Label.Detail></Label>
				<Label>Height <Label.Detail>
					<Pretty className="value" value={chain.height}/>
				</Label.Detail></Label>
				<Label>Authorities <Label.Detail>
					<Rspan className="value">{
						runtime.core.authorities.mapEach(a => <Identicon key={a} account={a} size={16}/>)
					}</Rspan>
				</Label.Detail></Label>
			</div>
			<Segment style={{margin: '1em'}}>
				<Header as='h2'>
					<Icon name='key' />
					<Header.Content>
						Wallet
						<Header.Subheader>Manage your secret keys</Header.Subheader>
					</Header.Content>
				</Header>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>seed</div>
					<InputBond
						bond={this.seed}
						reversible
						placeholder='Some seed for this key'
						validator={n => n || null}
						action={<Button content="Another" onClick={() => this.seed.trigger(generateMnemonic())} />}
						iconPosition='left'
						icon={<i style={{opacity: 1}} className='icon'><Identicon account={this.seedAccount} size={28} style={{marginTop: '5px'}}/></i>}
					/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>name</div>
					<InputBond
						bond={this.name}
						placeholder='A name for this key'
						validator={n => n ? secretStore().map(ss => ss.byName[n] ? null : n) : null}
						action={<TransformBondButton
							content='Create'
							transform={(name, seed) => secretStore().submit(seed, name)}
							args={[this.name, this.seed]}
							immediate
						/>}
					/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<WalletList/>
				</div>
			</Segment>
			<Divider hidden />
			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='tasks' />
					<Header.Content>
						Off-chain Tasks
						<Header.Subheader>Poc for Task, workers contributions, staking, reward  ...</Header.Subheader>
					</Header.Content>
				</Header>
  				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>Total Tasks :</div>
					<Label.Detail>
								<Pretty value={runtime.iexec.allTasksCount}/>
					</Label.Detail>
				</div>
				<div style={{ paddingBottom: '1em' }}></div>
				<TaskCards count={runtime.iexec.allTasksCount} />
				<div style={{ paddingBottom: '1em' }}></div>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>Scheduler</div>
					<SignerBond bond={this.accountCreateTask}/>
					<TransactButton
						content="Create task"
						icon='tasks'
						tx={{
							sender: runtime.indices.tryIndex(this.accountCreateTask),
							call: calls.iexec.createTask()
						}}
					/>			
				</div>
			</Segment>
			<Divider hidden />
			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='cogs' />
					<Header.Content>
						Off-chain Workers Contribute
						<Header.Subheader>Workers stake for contribute ...</Header.Subheader>
					</Header.Content>
				</Header>

				<div style={{ paddingBottom: '1em' }}></div>
				<div style={{paddingBottom: '1em'}}>
				<div style={{fontSize: 'small'}}>Contribution</div>


				<InputBond
					bond={this.contributionTaskId}
					placeholder='Task Id'
					validator={n => n || null}
				/>


				<InputBond
					bond={this.contribution}
					placeholder='Contribution Vote'
					validator={n => n || null}
				/>

				<InputBond
					bond={this.contributionSeal}
					placeholder='Contribution Sealed'
					validator={n => n || null}
				/>

					<div style={{fontSize: 'small'}}>Worker</div>

					<SignerBond bond={this.accountContribution}/>	
					<TransactButton
							content="Stake And Contribute"
							icon='cog'
							tx={{
								sender: runtime.indices.tryIndex(this.accountContribution),
								call: calls.iexec.contribute(this.contributionTaskId,this.contribution,this.contributionSeal)
							}}
						/>	
		
				</div>
			</Segment>
			<Divider hidden />

			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='cogs' />
					<Header.Content>
						Off-chain Workers Reveal 
						<Header.Subheader>Workers reveal and get rewarded if part of the consensus...</Header.Subheader>
					</Header.Content>
				</Header>
				<div style={{ paddingBottom: '1em' }}></div>
				<div style={{paddingBottom: '1em'}}>
				<div style={{fontSize: 'small'}}>Unseal Contribution</div>

				<InputBond
					bond={this.revealTaskId}
					placeholder='Task Id'
					validator={n => n || null}
				/>

				<InputBond
					bond={this.contributionUnseal}
					placeholder='Contribution unsealed'
					validator={n => n || null}
				/>

				<div style={{fontSize: 'small'}}>Worker</div>

				<SignerBond bond={this.accountReveal}/>	
				<TransactButton
					content="Reveal and Reward"
					icon='cog'
					tx={{
						sender: runtime.indices.tryIndex(this.accountReveal),
						call: calls.iexec.reveal(this.revealTaskId,this.contributionUnseal)
					}}
				/>	
				</div>
			</Segment>

			<Divider hidden />
			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='search' />
					<Header.Content>
						Address Book
						<Header.Subheader>Inspect the status of any account and name it for later use</Header.Subheader>
					</Header.Content>
				</Header>
  				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>lookup account</div>
					<AccountIdBond bond={this.lookup}/>
					<If condition={this.lookup.ready()} then={<div>
						<Label>Balance
							<Label.Detail>
								<Pretty value={runtime.balances.balance(this.lookup)}/>
							</Label.Detail>
						</Label>
						<Label>Nonce
							<Label.Detail>
								<Pretty value={runtime.system.accountNonce(this.lookup)}/>
							</Label.Detail>
						</Label>
						<Label>Address
							<Label.Detail>
								<Pretty value={this.lookup}/>
							</Label.Detail>
						</Label>
					</div>}/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>name</div>
					<InputBond
						bond={this.nick}
						placeholder='A name for this address'
						validator={n => n ? addressBook().map(ss => ss.byName[n] ? null : n) : null}
						action={<TransformBondButton
							content='Add'
							transform={(name, account) => { addressBook().submit(account, name); return true }}
							args={[this.nick, this.lookup]}
							immediate
						/>}
					/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<AddressBookList/>
				</div>
			</Segment>
			<Divider hidden />
			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='send' />
					<Header.Content>
						Send Funds
						<Header.Subheader>Send funds from your account to another</Header.Subheader>
					</Header.Content>
				</Header>
  				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>from</div>
					<SignerBond bond={this.source}/>
					<If condition={this.source.ready()} then={<span>
						<Label>Balance
							<Label.Detail>
								<Pretty value={runtime.balances.balance(this.source)}/>
							</Label.Detail>
						</Label>
						<Label>Nonce
							<Label.Detail>
								<Pretty value={runtime.system.accountNonce(this.source)}/>
							</Label.Detail>
						</Label>
					</span>}/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>to</div>
					<AccountIdBond bond={this.destination}/>
					<If condition={this.destination.ready()} then={
						<Label>Balance
							<Label.Detail>
								<Pretty value={runtime.balances.balance(this.destination)}/>
							</Label.Detail>
						</Label>
					}/>
				</div>
				<div style={{paddingBottom: '1em'}}>
					<div style={{fontSize: 'small'}}>amount</div>
					<BalanceBond bond={this.amount}/>
				</div>
				<TransactButton
					content="Send"
					icon='send'
					tx={{
						sender: runtime.indices.tryIndex(this.source),
						call: calls.balances.transfer(this.destination, this.amount)
					}}
				/>
			</Segment>
			<Divider hidden />
			<Segment style={{margin: '1em'}} padded>
				<Header as='h2'>
					<Icon name='search' />
					<Header.Content>
						Runtime Upgrade
						<Header.Subheader>Upgrade the runtime using the Sudo module</Header.Subheader>
					</Header.Content>
				</Header>
				<div style={{paddingBottom: '1em'}}></div>
				<FileUploadBond bond={this.runtime} content='Select Runtime' />
				<TransactButton
					content="Upgrade"
					icon='warning'
					tx={{
						sender: runtime.sudo.key,
						call: calls.sudo.sudo(calls.consensus.setCode(this.runtime))
					}}
				/>
			</Segment>
		</div>);
	}
}

