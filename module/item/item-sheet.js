/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
import { getLength, objectMapValues, objectReindexFilter, objectFindValue, objectSome } from '../../lib/helpers.js'
import { localizer } from '../scripts/foundryHelpers.js'
import {
  removeItems,
  toggleItems
} from '../scripts/sheetHelpers.js'

export class CortexPrimeItemSheet extends ItemSheet {

  get item () {
    return super.item
  }

  /** @override */
  static get defaultOptions() {
    console.log("in defaultOptions()");
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item', 'item-sheet'],
      template: "systems/cortexprime/templates/item/item-sheet.html",
      width: 640,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    })
  }

  get template() {
    const path = "systems/cortexprime/templates/item";
    console.log("inside get template()");
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  getData (options) {
    console.log("in getData");
    const data = super.getData(options)
    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]
    return {
      ...data,
      theme,
    }
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners (html) {
    super.activateListeners(html)
  }

  /* -------------------------------------------- */


  // async _addAsset (event) {
  //   event.preventDefault()
  //   const { path } = event.currentTarget.dataset
  //   const currentAssets = getProperty(this.actor.data, `${path}.assets`) ?? {}

  //   await this._resetDataPoint(path, 'assets', {
  //     ...currentAssets,
  //     [getLength(currentAssets)]: {
  //       label: localizer('NewAsset'),
  //       dice: {
  //         value: {
  //           0: '6'
  //         }
  //       }
  //     }
  //   })
  // }

  async _addToPool (event) {
    const { consumable, path, label } = event.currentTarget.dataset
    let value = getProperty(this.actor.data, `${path}.value`)
    if (consumable) {
      const selectedDice = await this._getConsumableDiceSelection(value, label)

      if (selectedDice.remove?.length) {
        const newValue = objectReindexFilter(value, (_, key) => !selectedDice.remove.map(x => parseInt(x, 10)).includes(parseInt(key, 10)))

        await this._resetDataPoint(path, 'value', newValue)
      }

      value = selectedDice.value
    }

    if (getLength(value)) {
      await game.cortexprime.UserDicePool._addTraitToPool(this.actor.name, label, value)
    }
  }


  // async _getConsumableDiceSelection (options, label) {
  //   const content = await renderTemplate('systems/cortexprime/templates/dialog/consumable-dice.html', {
  //     options,
  //     isOwner: game.user.isOwner
  //   })

  //   return new Promise((resolve, reject) => {
  //     new Dialog({
  //       title: label,
  //       content,
  //       buttons: {
  //         cancel: {
  //           icon: '<i class="fas fa-times"></i>',
  //           label: localizer('Cancel'),
  //           callback () {
  //             resolve({ remove: [], value: {} })
  //           }
  //         },
  //         done: {
  //           icon: '<i class="fas fa-check"></i>',
  //           label: localizer('AddToPool'),
  //           callback (html) {
  //             const remove = html.find('.remove-check').prop('checked')
  //             const selectedDice = html.find('.die-select.selected').get()

  //             if (!selectedDice?.length) {
  //               resolve({ remove: [], value: {} })
  //             }

  //             resolve(
  //               selectedDice
  //                 .reduce((selectedValues, selectedDie, index) => {
  //                   const $selectedDie = $(selectedDie)

  //                   if (remove) {
  //                     selectedValues.remove = [...selectedValues.remove, $selectedDie.data('key')]
  //                   }

  //                   selectedValues.value = { ...selectedValues.value, [getLength(selectedValues.value)]: $selectedDie.data('value') }

  //                   return selectedValues
  //                 }, { remove: [], value: {} })
  //             )
  //           }
  //         }
  //       },
  //       default: 'cancel',
  //       render(html) {
  //         html.find('.die-select').click(function () {
  //           const $dieContainer = $(this)
  //           const $dieCpt = $dieContainer.find('.die-cpt')
  //           $dieContainer.toggleClass('result selected')
  //           $dieCpt.toggleClass('unchosen-cpt chosen-cpt')
  //         })
  //       }
  //     }, { jQuery: true, classes: ['dialog', 'consumable-dice', 'cortexprime'] }).render(true)
  //   })
  // }

  // async _newDie (event) {
  //   event.preventDefault()
  //   const $targetNewDie = $(event.currentTarget)
  //   const target = $targetNewDie.data('target')
  //   const currentDiceData = getProperty(this.actor.data, target)
  //   const currentDice = currentDiceData?.value ?? {}
  //   const newIndex = getLength(currentDice)
  //   const newValue = currentDice[newIndex - 1] ?? '8'

  //   await this.actor.update({
  //     [target]: {
  //       value: {
  //         ...currentDice,
  //         [newIndex]: newValue
  //       }
  //     }
  //   })
  // }

  // async _onDieChange (event) {
  //   event.preventDefault()
  //   const $targetNewDie = $(event.currentTarget)
  //   const target = $targetNewDie.data('target')
  //   const targetKey = $targetNewDie.data('key')
  //   const targetValue = $targetNewDie.val()
  //   const currentDiceData = getProperty(this.actor.data, target)

  //   const newValue = objectMapValues(currentDiceData.value ?? {}, (value, index) => parseInt(index, 10) === targetKey ? targetValue : value)

  //   await this._resetDataPoint(target, 'value', newValue)
  // }

  // async _onDieRemove (event) {
  //   event.preventDefault()

  //   if (event.button === 2) {
  //     const $target = $(event.currentTarget)
  //     const target = $target.data('target')
  //     const targetKey = $target.data('key')
  //     const currentDiceData = getProperty(this.actor.data, target)

  //     const newValue = objectReindexFilter(currentDiceData.value ?? {}, (_, key) => parseInt(key, 10) !== parseInt(targetKey))

  //     await this._resetDataPoint(target, 'value', newValue)
  //   }
  // }

  // async _ppNumberChange (event) {
  //   event.preventDefault()
  //   const $field = $(event.currentTarget)
  //   const parsedValue = parseInt($field.val(), 10)
  //   const currentValue = parseInt(this.actor.data.data.pp.value, 10)
  //   const newValue = parsedValue < 0 ? 0 : parsedValue
  //   const changeAmount = newValue - currentValue

  //   this.actor.changePpBy(changeAmount, true)
  // }
}
