'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const View = use('View')

class CanTag extends View.engine.BaseTag {
  /**
   * The tag name
   *
   * @method tagName
   *
   * @return {String}
   */
  get tagName () {
    return 'can'
  }

  /**
   * Tag is not a block tag
   *
   * @method isBlock
   *
   * @return {Boolean}
   */
  get isBlock () {
    return true
  }

  /**
   * Compile method to create block
   *
   * @method compile
   *
   * @param  {Object} compiler
   * @param  {Object} lexer
   * @param  {Object} buffer
   * @param  {String} options.body
   * @param  {Array} options.childs
   * @param  {Number} options.lineno
   *
   * @return {void}
   */
  compile (compiler, lexer, buffer, { body, childs, lineno }) {
    const compiledStatement = this._compileStatement(lexer, body, lineno).toStatement()

    /**
     * Open tag
     */
    buffer.writeLine(`if (this.context.can(${compiledStatement})) {`)
    buffer.indent()

    /**
     * Re-parse all childs via compiler.
     */
    childs.forEach((child) => compiler.parseLine(child))

    /**
     * Close the tag
     */
    buffer.dedent()
    buffer.writeLine('}')
  }

  /**
   * Nothing needs to be done at runtime
   *
   * @method run
   */
  run (Context) {
    Context.macro('can', function (expression) {
      // expression = expression.replace(/'/g, "").split(',')
      console.log(expression)
      const permissions = this.accessChild(this.resolve('watchtower'), ['permissions'])
      
      return permissions.some((permission) => {
        return expression.includes(permission)
      })
    })
  }
}


module.exports = CanTag