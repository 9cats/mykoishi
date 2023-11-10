import { Context, Service, segment, Argv, Logger } from "koishi"
import Gamedig from "./gamedig"
// import * as Gamedig from "gamedig"
// import * as Gamedig from "gamedig"


export class GameDigService extends Service {
  dataDir: string
  _logger: Logger
  
  constructor(ctx: Context) {
    super(ctx, "gamedig", false)
    this.dataDir = ctx.root.baseDir + "/data/gamedig"
    this._logger = ctx.logger("gamedig")
  }

  // no check
  async query(options: Gamedig.QueryOptions) {
    return await Gamedig.query(options)
  }

  // async middleware() {}
}

export default GameDigService