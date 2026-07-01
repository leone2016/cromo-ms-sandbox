import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { DocumentClient, GetItemOutput, Key } from "aws-sdk/clients/dynamodb";
import { Observable, of } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";
import { DynamoUpdateActionsEnum } from "./DynamoUpdateActionsEnum";

@Injectable()
export class DynamoGateway {
  private readonly _client: DocumentClient;

  constructor() {
    this._client = new AWS.DynamoDB.DocumentClient();
  }

  public getItem(table: string, key: object): Observable<object | undefined> {
    const params: DocumentClient.GetItemInput = {
      Key: <Key>key,
      TableName: table,
    };

    return of(1).pipe(
      switchMap(async () => this._client.get(params).promise()),
      map((item: GetItemOutput) => item.Item)
    );
  }

  public put(data: any, table: string): Observable<boolean> {
    const now = new Date().toISOString();
    const params: DocumentClient.PutItemInput = {
      Item: {
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: now,
      },
      TableName: table,
    };

    return this._put(params);
  }
  private _put(params: DocumentClient.PutItemInput): Observable<boolean> {
    return of(1).pipe(
      switchMap(async () => this._client.put(params).promise()),
      mapTo(true)
    );
  }

  public query<T>(queryParams: {
    table: string;
    index?: string;
    field: string;
    value: string;
  }): Observable<T[]> {
    return of(1).pipe(
      switchMap(async () => {
        const params: DocumentClient.QueryInput = {
          ExpressionAttributeNames: {
            [`#${queryParams.field}`]: queryParams.field,
          },
          ExpressionAttributeValues: {
            ":d": queryParams.value,
          },
          KeyConditionExpression: `#${queryParams.field} = :d`,
          TableName: queryParams.table,
        };

        if (queryParams.index) {
          params.IndexName = queryParams.index;
        }

        return this._client.query(params).promise();
      }),
      map((output: DocumentClient.QueryOutput) => (output.Items as T[]) ?? [])
    );
  }

  public updateItem<T>(
    table: string,
    key: object,
    action: DynamoUpdateActionsEnum,
    field: string,
    newValue?: T
  ): Observable<boolean> {
    const updateInput = this._getUpdateInput<T>(
      action,
      table,
      key,
      field,
      newValue
    );

    return of(1).pipe(
      switchMap(async () => this._client.update(updateInput).promise()),
      mapTo(true)
    );
  }

  public deleteItem(table: string, key: object): Observable<boolean> {
    const params: DocumentClient.DeleteItemInput = {
      Key: <Key>key,
      TableName: table,
    };

    return of(1).pipe(
      switchMap(async () => this._client.delete(params).promise()),
      mapTo(true)
    );
  }

  private _getUpdateInput<K>(
    action: DynamoUpdateActionsEnum,
    table: string,
    key: object,
    field: string,
    newValue?: K
  ): DocumentClient.UpdateItemInput {
    let updateInput: DocumentClient.UpdateItemInput;

    if (action === DynamoUpdateActionsEnum.REMOVE) {
      updateInput = {
        Key: <Key>key,
        TableName: table,
        UpdateExpression: `${action} ${field}`,
      };
    } else {
      updateInput = {
        ExpressionAttributeValues: {
          ":a": newValue,
        },
        Key: <Key>key,
        TableName: table,
        UpdateExpression: `${action} ${field}=:a`,
      };
    }

    return updateInput;
  }
}
