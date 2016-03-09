'use strict';

var expect = require('chai').expect;
var Dimensions = require('../../../lib/utils/dimensions');

describe('Dimensions', function() {

  function check(d, range, $range, tl, $t$l, br, $b$r, top, left, bottom, right) {
    expect(d.range).to.equal(range);
    expect(d.$range).to.equal($range);
    expect(d.tl).to.equal(tl);
    expect(d.$t$l).to.equal($t$l);
    expect(d.br).to.equal(br);
    expect(d.$b$r).to.equal($b$r);
    expect(d.top).to.equal(top);
    expect(d.left).to.equal(left);
    expect(d.bottom).to.equal(bottom);
    expect(d.right).to.equal(right);
    expect(d.toString()).to.equal(range);
  }

  it('has a valid default value', function() {
    var d = new Dimensions();
    check(d, 'A1:A1', '$A$1:$A$1', 'A1', '$A$1', 'A1', '$A$1', 1, 1, 1, 1);
  });

  it('constructs as expected', function() {
    // check range + rotations
    check(new Dimensions('B5:D10'), 'B5:D10', '$B$5:$D$10', 'B5', '$B$5', 'D10', '$D$10', 5, 2, 10, 4);
    check(new Dimensions('B10:D5'), 'B5:D10', '$B$5:$D$10', 'B5', '$B$5', 'D10', '$D$10', 5, 2, 10, 4);
    check(new Dimensions('D5:B10'), 'B5:D10', '$B$5:$D$10', 'B5', '$B$5', 'D10', '$D$10', 5, 2, 10, 4);
    check(new Dimensions('D10:B5'), 'B5:D10', '$B$5:$D$10', 'B5', '$B$5', 'D10', '$D$10', 5, 2, 10, 4);

    check(new Dimensions('G7','C16'), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', '$G$16', 'G16', 7, 3, 16, 7);
    check(new Dimensions('C7','G16'), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', '$G$16', 'G16', 7, 3, 16, 7);
    check(new Dimensions('C16','G7'), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', '$G$16', 'G16', 7, 3, 16, 7);
    check(new Dimensions('G16','C7'), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', '$G$16', 'G16', 7, 3, 16, 7);

    check(new Dimensions(7, 3, 16, 7), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions(16, 3, 7, 7), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions(7, 7, 16, 3), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions(16, 7, 7, 3), 'C7:G16', '$C$7:$G$16', 'C7', '$C$7', 'G16', '$G$16', 7, 3, 16, 7);

    check(new Dimensions([7, 3, 16, 7]), 'C7:G16', '$C$7:$G$16', 'C7', '$C47', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions([16, 3, 7, 7]), 'C7:G16', '$C$7:$G$16', 'C7', '$C47', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions([7, 7, 16, 3]), 'C7:G16', '$C$7:$G$16', 'C7', '$C47', 'G16', '$G$16', 7, 3, 16, 7);
    check(new Dimensions([16, 7, 7, 3]), 'C7:G16', '$C$7:$G$16', 'C7', '$C47', 'G16', '$G$16', 7, 3, 16, 7);

    check(new Dimensions('B5'), 'B5:B5', '$B$5:$B$5', 'B5', '$B$5', 'B5', '$B$5', 5, 2, 5, 2);
  });


  it('expands properly', function() {
    var d = new Dimensions();

    d.expand(1,1,1,3);
    expect(d.tl).to.equal('A1');
    expect(d.br).to.equal('C1');
    expect(d.toString()).to.equal('A1:C1');

    d.expand(1,3,3,3);
    expect(d.tl).to.equal('A1');
    expect(d.br).to.equal('C3');
    expect(d.toString()).to.equal('A1:C3');
  });

  it('doesn\'t always include the default row/col', function() {
    var d = new Dimensions();

    d.expand(2,2,4,4);
    expect(d.tl).to.equal('B2');
    expect(d.br).to.equal('D4');
    expect(d.toString()).to.equal('B2:D4');
  });

  it('detects intersections', function() {
    var C3F6 = new Dimensions('C3:F6');

    // touching at corners
    expect(C3F6.intersects(new Dimensions('A1:B2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G1:H2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A7:B8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G7:H8'))).to.not.be.ok;

    // Adjacent to edges
    expect(C3F6.intersects(new Dimensions('A1:H2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A1:B8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G1:H8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A7:H8'))).to.not.be.ok;

    // 1 cell margin
    expect(C3F6.intersects(new Dimensions('A1:H1'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A1:A8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G1:G8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A8:G8'))).to.not.be.ok;

    // Adjacent at corners
    expect(C3F6.intersects(new Dimensions('A1:B3'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A1:C2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('F1:H2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G1:H3'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A6:B8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('A7:C8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('F7:H8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G6:H8'))).to.not.be.ok;

    // Adjacent at edges
    expect(C3F6.intersects(new Dimensions('A4:B5'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('D1:E2'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('D7:E8'))).to.not.be.ok;
    expect(C3F6.intersects(new Dimensions('G4:H8'))).to.not.be.ok;

    // intersecting at corners
    expect(C3F6.intersects(new Dimensions('A1:C3'))).to.be.ok;
    expect(C3F6.intersects(new Dimensions('F1:H3'))).to.be.ok;
    expect(C3F6.intersects(new Dimensions('A6:C8'))).to.be.ok;
    expect(C3F6.intersects(new Dimensions('F6:H8'))).to.be.ok;

    // slice through middle
    expect(C3F6.intersects(new Dimensions('A4:H5'))).to.be.ok;
    expect(C3F6.intersects(new Dimensions('D1:E8'))).to.be.ok;

    // inside
    expect(C3F6.intersects(new Dimensions('D4:E5'))).to.be.ok;

    // outside
    expect(C3F6.intersects(new Dimensions('A1:H8'))).to.be.ok;
  });
});