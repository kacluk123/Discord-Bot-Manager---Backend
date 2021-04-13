import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express'

interface ICookie {
  name: string
  cookie: string
  options: {
    httpOnly?: boolean,
    secure?: boolean,
    sameSite?: boolean | "none" | "lax" | "strict"
  }
}

export interface RequestWithCookie extends Request {
  _cookies: ICookie[]
}

@Injectable()
export class CookiesService {
  public addCookiesToRequestObject(cookies: ICookie[], req: RequestWithCookie) {
    req._cookies = cookies
  }

  public setCookies(res: Response, cookies: ICookie[]) {
    for (const { cookie, name, options } of cookies ) {
      res.cookie(name, cookie, options)
    }
  }
}
