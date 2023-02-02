import express from "express";
import cors from "cors"
import { config } from '~/config';

import { OrgsRouter } from "~/routers/orgs.router"

import { ExceptionsHandler } from '~/handlers/exceptions.handler'
import { NotFoundHandler } from '~/handlers/notFound.handler'

const port = config.API_PORT || 3000
const app = express()

app.use(express.json())
app.use(cors());

app.use('/', OrgsRouter);

app.all('*', NotFoundHandler)
app.use(ExceptionsHandler)


app.listen(port, () => console.log(`App listening on port ${port}!`));