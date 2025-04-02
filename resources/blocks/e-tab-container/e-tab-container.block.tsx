import {
  InnerBlocks,
  InspectorControls,
  RichText,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
  BlockEditProps,
  registerBlockType,
  TemplateArray,
} from '@wordpress/blocks';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import block from './block.json';

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                      					The block props.
 * @returns {Function}                                    Render the edit screen
 */

type AttributesType = {
  coverImage: string;
  hideTitle: boolean;
  title: string;
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-tab-container inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-tab-container.allowedBlocks',
    null,
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-tab-container inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template;
  const template: TemplateArray = applyFilters(
    'webentor.core.e-tab-container.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template,
  });

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
          <PanelRow>
            <ToggleControl
              label={__('Hide title', 'webentor')}
              help={__(
                'Title would be used only in Tabs navigation, but hidden in the content area.',
                'webentor',
              )}
              checked={attributes.hideTitle}
              onChange={(hideTitle) => setAttributes({ hideTitle })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} className={`${blockProps.className}`}>
        <div className="md:wbtr:pt-8 wbtr:flex wbtr:w-full wbtr:flex-col wbtr:border wbtr:border-editor-border wbtr:px-4 wbtr:pt-5 wbtr:pb-4">
          <RichText
            tagName="h2"
            placeholder={__('Tab Title (required)', 'webentor')}
            value={attributes.title}
            onChange={(title) => setAttributes({ title })}
          />

          <div
            {...innerBlocksProps}
            className={`${innerBlocksProps.className} wbtr:border wbtr:border-editor-border wbtr:p-4`}
          />
        </div>
      </div>
    </>
  );
};

/**
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#save
 *
 * @return {null} Dynamic blocks do not save the HTML.
 */
const BlockSave = () => <InnerBlocks.Content />;

/**
 * Register block.
 */
registerBlockType(block, {
  edit: BlockEdit,
  save: BlockSave,
});
