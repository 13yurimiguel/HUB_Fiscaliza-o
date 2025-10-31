import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace } from '@opentelemetry/api';

@Injectable()
export class AuditTrailInterceptor implements NestInterceptor {
  intercept(contextExecution: ExecutionContext, next: CallHandler): Observable<any> {
    const tracer = trace.getTracer('audit-trail');
    const request = contextExecution.switchToHttp().getRequest();
    const span = tracer.startSpan('http.request', {
      attributes: {
        method: request?.method,
        url: request?.url,
        user: request?.user?.id,
      },
    });

    const startTime = Date.now();
    return next.handle().pipe(
      tap({
        next: () => {
          span.setAttributes({
            'http.response_time_ms': Date.now() - startTime,
            status: contextExecution.switchToHttp().getResponse()?.statusCode,
          });
          span.end();
        },
        error: (err) => {
          span.recordException(err);
          span.end();
        },
      }),
    );
  }
}
