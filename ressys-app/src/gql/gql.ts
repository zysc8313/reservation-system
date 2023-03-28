/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation CancelOrder($id: String!) {\n    cancelOrder(id: $id)\n  }\n": types.CancelOrderDocument,
    "\n  mutation CompleteOrder($id: String!) {\n    completeOrder(id: $id)\n  }\n": types.CompleteOrderDocument,
    "\n  mutation ConfirmOrder($id: String!) {\n    confirmOrder(id: $id)\n  }\n": types.ConfirmOrderDocument,
    "\n  mutation Login($input: LoginWithEmailInput!) {\n    login(input: $input) {\n      user {\n        _id\n        email\n        role\n      }\n      token\n    }\n  }\n": types.LoginDocument,
    "\n  query Orders($filter: OrderFilterInput) {\n    orders(filter: $filter) {\n      _id\n      user {\n        _id\n        email\n        role\n      }\n      guestName\n      phoneNumber\n      expectedArrivalTime\n      reservedTableSize\n      status\n    }\n  }\n": types.OrdersDocument,
    "\n  mutation PlaceOrder($order: PlaceOrderInput!) {\n    placeOrder(order: $order) {\n      _id\n      status\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n": types.PlaceOrderDocument,
    "\n  mutation UpdateOrder($order: UpdateOrderInput!) {\n    updateOrder(order: $order) {\n      _id\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n": types.UpdateOrderDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelOrder($id: String!) {\n    cancelOrder(id: $id)\n  }\n"): (typeof documents)["\n  mutation CancelOrder($id: String!) {\n    cancelOrder(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteOrder($id: String!) {\n    completeOrder(id: $id)\n  }\n"): (typeof documents)["\n  mutation CompleteOrder($id: String!) {\n    completeOrder(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmOrder($id: String!) {\n    confirmOrder(id: $id)\n  }\n"): (typeof documents)["\n  mutation ConfirmOrder($id: String!) {\n    confirmOrder(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginWithEmailInput!) {\n    login(input: $input) {\n      user {\n        _id\n        email\n        role\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginWithEmailInput!) {\n    login(input: $input) {\n      user {\n        _id\n        email\n        role\n      }\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Orders($filter: OrderFilterInput) {\n    orders(filter: $filter) {\n      _id\n      user {\n        _id\n        email\n        role\n      }\n      guestName\n      phoneNumber\n      expectedArrivalTime\n      reservedTableSize\n      status\n    }\n  }\n"): (typeof documents)["\n  query Orders($filter: OrderFilterInput) {\n    orders(filter: $filter) {\n      _id\n      user {\n        _id\n        email\n        role\n      }\n      guestName\n      phoneNumber\n      expectedArrivalTime\n      reservedTableSize\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PlaceOrder($order: PlaceOrderInput!) {\n    placeOrder(order: $order) {\n      _id\n      status\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n"): (typeof documents)["\n  mutation PlaceOrder($order: PlaceOrderInput!) {\n    placeOrder(order: $order) {\n      _id\n      status\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOrder($order: UpdateOrderInput!) {\n    updateOrder(order: $order) {\n      _id\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOrder($order: UpdateOrderInput!) {\n    updateOrder(order: $order) {\n      _id\n      guestName\n      phoneNumber\n      reservedTableSize\n      expectedArrivalTime\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;