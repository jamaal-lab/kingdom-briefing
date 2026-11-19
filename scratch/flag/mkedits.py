"""Turn old->new into a minimal ordered list of unique find/replace edits (line based)."""
import difflib, json, sys
old = open(sys.argv[1]).read(); new = open(sys.argv[2]).read(); out = sys.argv[3]
a = old.splitlines(keepends=True); b = new.splitlines(keepends=True)
ops = [o for o in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if o[0] != 'equal']
edits = []
for tag, i1, i2, j1, j2 in ops:
    lo, hi = i1, i2
    # grow context until the find string is unique in the document
    while True:
        find = ''.join(a[lo:hi]); rep = ''.join(a[lo:i1]) + ''.join(b[j1:j2]) + ''.join(a[i2:hi])
        if find and old.count(find) == 1:
            break
        if lo > 0: lo -= 1
        if hi < len(a): hi += 1
    edits.append({'find': find, 'replace': rep, '_pos': lo})
# apply in order, verify
t = old
for e in edits:
    assert t.count(e['find']) == 1, 'not unique after earlier edits'
    t = t.replace(e['find'], e['replace'])
assert t == new, 'edits do not reproduce target'
for e in edits: e.pop('_pos')
json.dump(edits, open(out, 'w'), ensure_ascii=False)
print(len(edits), 'edits', sum(len(e['find']) + len(e['replace']) for e in edits), 'chars')
