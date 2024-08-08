/*\
title: test-attachment.js
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests attachments.

\*/
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var AttachmentStore = require("$:/plugins/tiddlywiki/multiwikiserver/store/attachments.js").AttachmentStore;

(function() {
"use strict";

describe('AttachmentStore', function() {
  var storePath = './editions/test/test-store';
  var attachmentStore = new AttachmentStore({ storePath: storePath });

  afterAll(function() {
    fs.readdirSync(storePath).forEach(function(file) {
      var filePath = path.join(storePath, file);
      if(fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else if(fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      }
    });
  });

  it('isValidAttachmentName', function() {
    expect(attachmentStore.isValidAttachmentName('abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890')).toBe(true);
    expect(attachmentStore.isValidAttachmentName('invalid-name')).toBe(false);
  });

  it('saveAttachment', function() {
    var options = {
      text: 'Hello, World!',
      type: 'text/plain',
      reference: 'test-reference',
    };
    var contentHash = attachmentStore.saveAttachment(options);
    assert.strictEqual(contentHash.length, 64);
    assert.strictEqual(fs.existsSync(path.resolve(storePath, 'files', contentHash)), true);
  });
 
  it('adoptAttachment', function() {
    var incomingFilepath = path.resolve(storePath, 'incoming-file.txt');
    fs.writeFileSync(incomingFilepath, 'Hello, World!');
    var type = 'text/plain';
    var hash = 'abcdef0123456789abcdef0123456789';
    var canonicalUri = 'test-canonical-uri';
    attachmentStore.adoptAttachment(incomingFilepath, type, hash, canonicalUri);
    expect(fs.existsSync(path.resolve(storePath, 'files', hash))).toBe(true);
  });
 
  it('getAttachmentStream', function() {
    var options = {
      text: 'Hello, World!',
      type: 'text/plain',
      filename: 'data.txt',
    };
    var contentHash = attachmentStore.saveAttachment(options);
    var stream = attachmentStore.getAttachmentStream(contentHash);
    expect(stream).not.toBeNull();
    expect(stream.type).toBe('text/plain');
  });

  it('getAttachmentFileSize', function() {
    var options = {
      text: 'Hello, World!',
      type: 'text/plain',
      reference: 'test-reference',
    };
    var contentHash = attachmentStore.saveAttachment(options);
    var fileSize = attachmentStore.getAttachmentFileSize(contentHash);
    expect(fileSize).toBe(13);
  });

  it('getAttachmentMetadata', function() {
    var options = {
      text: 'Hello, World!',
      type: 'text/plain',
      filename: 'data.txt',
    };
    var contentHash = attachmentStore.saveAttachment(options);
    var metadata = attachmentStore.getAttachmentMetadata(contentHash);
    expect(metadata).not.toBeNull();
    expect(metadata.type).toBe('text/plain');
    expect(metadata.filename).toBe('data.txt');
  });
});

})();
