/**
 * LoopBack Application
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { DocumentocategoriasInclude } from './documentocategoriasInclude';
import { DocumentosempresaIdFields } from './documentosempresaIdFields';

export interface Filter1 {
  where?: { [key: string]: any };
  fields?: DocumentosempresaIdFields;
  offset?: number;
  limit?: number;
  skip?: number;
  order?: Array<string>;
  include?: Array<DocumentocategoriasInclude>;
}
