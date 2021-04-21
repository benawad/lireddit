import { GraphQLResolveInfo } from 'graphql';

export const checkForObjectSelection = (info: GraphQLResolveInfo, fields: string[]) => {
  let parent = info.operation.selectionSet;
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    const selectionNode = parent.selections.find(selection=>(selection as any).name.value === field) ?? false;
    if(selectionNode && "selectionSet" in selectionNode)
      parent = selectionNode.selectionSet!
    else return false;
  }
  return true;
};
