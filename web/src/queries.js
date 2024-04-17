import { gql } from 'graphql-tag';

export const GET_FIGURES = gql`
  query GetFigures {
    figures {
      id
      top
      left
      width
      height
      offsetx
      offsety
      draggable
    }
  }
`;

export const ADD_FIGURE = gql`
  mutation AddFigure (
    $top: Int!,
    $left: Int!,
    $width: Int!,
    $height: Int!,
    $offsetx: Int!,
    $offsety: Int!,
    $draggable: Boolean!,
    $wsid: String!
  ) {
    addFigure(
      top: $top,
      left: $left,
      width: $width,
      height: $height,
      offsetx: $offsetx,
      offsety: $offsety,
      draggable: $draggable,
      wsid: $wsid
    ) {
      figure {
        top
        left
        width
        height
        offsetx
        offsety
        draggable
      }
    }
  }`;

export const UPDATE_FIGURE = gql`
    mutation updateFigure (
      $pk: Int!,
      $top: Int,
      $left: Int,
      $width: Int,
      $height: Int
      $offsetx: Int,
      $offsety: Int,
      $draggable: Boolean
    ){
      updateFigure(
        pk: $pk,
        top: $top,
        left: $left,
        width: $width,
        height: $height,
        offsetx: $offsetx,
        offsety: $offsety,
        draggable: $draggable
    ) {
      ok,
    }
}`;


export const DELETE_ALL_FIGURES = gql`
mutation {
      deleteFigures {
      ok
    }
}`;
