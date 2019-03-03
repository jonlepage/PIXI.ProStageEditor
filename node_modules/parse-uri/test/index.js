/* global describe, it */

'use strict'

var URI = require('..')
var should = require('should')

var URLS = [
  'https://github.com/garycourt/uri-js',
  'magnet:?xt=urn:sha1:PDAQRAOQQRYS76MRZJ33LK4MMVZBDSCL',
  'https://🐀.ws/🐀🐀'
]

describe('parse uri', function () {
  it('works fine', function () {
    URLS.forEach(function (url) {
      URI(url).protocol.should.be.ok()
    })
  })
})
