'''
This script is used to parse the html page http://mindprod.com/jgloss/
for both compile time errors and runtime errors

Use only the body text starting from the first error description (only the big table) from the html file directly strip away any unwanted data.
'''

from bs4 import BeautifulSoup

def addEscapeSeq(err_name):
	err_name = err_name.replace('{', '\{')
	err_name = err_name.replace('}', '\}')
	err_name = err_name.replace('(', '\(')
	err_name = err_name.replace(')', '\)')
	err_name = err_name.replace('[', '\[')
	err_name = err_name.replace(']', '\]')
	print(err_name)
	return err_name

def removeTags(err_desc):
	err_desc = err_desc.replace("<td colspan=\"2\">", "")
	err_desc = err_desc.replace("</td>", "")
	err_desc = addEscapeSeq(err_desc)
	return err_desc

def main():
	outfp = open("rules_runtime.txt", "w")
	with open("excep2.html") as fp:
		soup = BeautifulSoup(fp)

	i = 0
	a_tag_anchor = ""
	err_name = ""
	err_desc = ""
	tr = soup.find_all('tr')
	for each_tr_tag in tr:
		if i%2 == 0:
			a_tag = each_tr_tag.th.a.extract()
			a_tag_anchor = a_tag['id']
			#err_name = each_tr_tag.th.getText() #uncomment for compile errors and comment next 4 lines
			span_tag = each_tr_tag.th.span
			if span_tag == 'None':
				err_name = each_tr_tag.th.span.getText()
			else:
				err_name = each_tr_tag.th.getText()

		else:
			#err_desc = each_tr_tag.td.getText()
			err_desc = str(each_tr_tag.td)
			err_desc = removeTags(err_desc)
			a_tag_anchor = addEscapeSeq(a_tag_anchor)
			err_name = addEscapeSeq(err_name)
			outfp.write('u: (' + a_tag_anchor.lower() + ') ' + err_desc + '\n\n')
			outfp.write('u: (' + err_name.lower() + ') ' + err_desc + '\n\n')
		i = i+1

main()
