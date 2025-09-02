import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import AssetStore from '../assets/AssetStore';

const MESH_UI_ATTRIBUTE_NAMES = [
    'offset', 
    'width', 'height',
    'fontSize', 'fontKerning', 'fontColor', 'fontOpacity', 'fontSupersampling', 'fontFamily', 'fontTexture',
    'padding',
    'margin',
    'contentDirection',
    'justifyContent',
    'alignItems',
    'interline',
    'hiddenOverflow',
    'bestFit',
    'backgroundColor', 'backgroundOpacity', 'backgroundTexture', 'backgroundSize',
    'borderRadius', 'borderWidth', 'borderColor',
    'content',
    'letterSpacing',
    'textAlign',
    'whitespace',
    'breakOn'
];

export interface UserInterfaceJSON {
    type: 'Text' | 'Block' | 'InlineBlock' | 'Keyboard';
    children?: UserInterfaceJSON[];

    // Common attributes
    offset?: number;

    // Block layout attributes
    width?: number; // width in world units
    height?: number;

    fontSize?: number;

    padding?: number;
    margin?: number;

    contentDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'; // "flex-direction" of Block children
    justifyContent?: 'start' | 'end'| 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'start' | 'end' | 'center' | 'stretch';

    interline?: number;

    hiddenOverflow?: boolean;

    // Block style attributes
    bestFit?: 'none' | 'shrink' | 'grow' | 'auto';

    backgroundColor?: THREE.Color;
    backgroundOpacity?: number;
    backgroundTexture?: THREE.Texture;
    backgroundSize?: 'stretch' | 'contain' | 'cover';

    borderRadius?: number | number[];
    borderWidth?: number;
    borderColor?: THREE.Color;

    // Text layout attributes
    content?: string;
    fontKerning?: 'none' | 'normal';
    letterSpacing?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify' | 'justify-left' | 'justify-center' | 'justify-right';
    whitespace?: 'normal' | 'pre-line' | 'pre-wrap' | 'pre' | 'nowrap';
    breakOn?: string;

    // Text style attributes
    fontColor?: THREE.Color;
    fontOpacity?: number;
    fontSupersampling?: number;
}

export const createUIComponent = async (userInterfaceJSON, parentObject3D: THREE.Object3D, assetStore: AssetStore) => {
    const { type, children, ...attributes } = userInterfaceJSON;

    // Separate attributes into attributes for the Object3D constructor, vs
    // attributes that should be applied to the component (an Object3D) after construction.
    const meshUIAttributes: any = {};
    const object3DAttributes: any = {};
    for (let attr in attributes) {
        if (MESH_UI_ATTRIBUTE_NAMES.includes(attr)) {
            meshUIAttributes[attr] = attributes[attr];
        } else {
            object3DAttributes[attr] = attributes[attr];
        }
    }
  
    // .fontFamily can be an asset path (a string)
    if (typeof meshUIAttributes.fontFamily === 'string') {
        const fontFamilyAsset = await assetStore.load(meshUIAttributes.fontFamily);
        meshUIAttributes.fontFamily = fontFamilyAsset.data;
    }

    // .fontTexture can be an asset path (instead of an absolute URL)
    if (typeof meshUIAttributes.fontTexture === 'string' && !meshUIAttributes.fontTexture.includes('://')) {
        const fontTextureAsset = await assetStore.load(meshUIAttributes.fontTexture);
        meshUIAttributes.fontTexture = await fontTextureAsset.getFullURL();
    }

    if (!type) {
        throw new Error(`createUIComponent: type is required`);
    }

    const validComponentTypes = ['Text', 'Block', 'InlineBlock', 'Keyboard'];
    if (!validComponentTypes.includes(type)) {
        throw new Error(`createUIComponent: invalid component type: ${type}`);
    }

    const component: THREE.Object3D = new ThreeMeshUI[type](meshUIAttributes);

    for (const objAttr in object3DAttributes) {
        component[objAttr] = object3DAttributes[objAttr];
    }

    if (!component.name) {
        component.name = `mesh-ui-${type.toLowerCase()}`;
    }

    if (!parentObject3D) {
        throw new Error(`createUIComponent: must provide an Object3D to parent this component`);
    }

    parentObject3D.add(component);

    if (children) {
        for (let child of children) {
            await createUIComponent(child, component, assetStore);
        }
    }
};