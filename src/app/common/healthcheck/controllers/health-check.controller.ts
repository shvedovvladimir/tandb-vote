import { Controller, Get, HttpStatus, Response } from '@nestjs/common';

const {OK} = HttpStatus;

@Controller('api/healthcheck')
export class HealthCheckController {

    @Get()
    public async healthCheck(@Response() response: any): Promise<any> {
        response.status(OK).send();
    }
}
