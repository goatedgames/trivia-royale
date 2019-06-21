| eventName    | Sender | Contents            | Notes                                          |
| ------------ | ------ | ------------------- | ---------------------------------------------- |
| userJoin     | client | username: string    | Sent on input submit                           |
| idRes        | server | id: string          | Response to userJoin. Client switches to lobby |
| lobbyReq     | client |                     | Results in lobbyUpd                            |
| lobbyUpd     | server | usernames: [string] | Sent on update to connected player pool        |
| screenChange | server | screen: int         | Authoritative screen change - only Game cares  |