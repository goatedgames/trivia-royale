| eventName    | Sender | Contents                                                       | Notes                                          |
| ------------ | ------ | -------------------------------------------------------------- | ---------------------------------------------- |
| userJoin     | client | username: string                                               | Sent on input submit                           |
| idRes        | server | id: string                                                     | Response to userJoin. Client switches to lobby |
| lobbyReq     | client |                                                                | Results in lobbyUpd                            |
| lobbyUpd     | server | usernames: [string]                                            | Sent on update to connected player pool        |
| screenChange | server | screen: int                                                    | Authoritative screen change - only Game cares  |
| QReq         | client |                                                                | Results in newQ                                |
| newQ         | server | q: string, choices: [string], url: string                      |                                                |
| ans          | client | i: int                                                         | On client answer to newQ                       |
| startReq     | host   |                                                                |                                                |
| livesReq     | client |                                                                |                                                |
| livesRes     | server | lives: int                                                     | On response to livesReq                        |
| reasonReq    | client |                                                                |                                                |
| reasonRes    | server | msg: string                                                    | On response to reasonReq                       |
| matchReq     | client |                                                                |                                                |
| matchRes     | server | oppoName: string, oppoLives: int, myName: string, myLives: int | On response to matchReq                        |