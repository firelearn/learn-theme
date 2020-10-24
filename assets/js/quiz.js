let quiz_answers = {}

const groupMap = (groupKey, mapKey) => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const key = obj[groupKey];
    const value = obj[mapKey];
    objectsByKeyValue[key] = (objectsByKeyValue[key] || []).concat(value);
    return objectsByKeyValue;
  }, {})

function submitQuiz(ev) {
  ev.preventDefault();
  let frm = $(this);
  let quizName = frm.find('ol').attr('name');
  let data = frm.serializeArray();
  let grouped = groupMap('name', 'value')(data);
  let correct = Object.keys(grouped).filter(nm => JSON.stringify(quiz_answers[nm] ?? []) == JSON.stringify(grouped[nm]))
  let num_answers = Object.keys(quiz_answers).length;
  let num_correct = correct.length;
  let response = {
    name: quizName,
    value: (num_correct / num_answers)
  }
  let json = JSON.stringify(response);
  alert(json);
}


$(document).ready(function(){
  // console.log("QUIZ: Preparing");
  var frm = $('.pageContent > ol').wrap('<form id="quizform"></form>');
  frm = $('#quizform');
  frm.submit(submitQuiz);
  frm.append('<input type="submit"/>');
  $('.pageContent form > ol > li > ol').each(function() {
    let container = $(this);
    let name = container.attr('name');
    let answer = container.attr('answer');
    // console.log(`QUIZ: Preparing question ${name}`);
    container.removeAttr('name');
    container.removeAttr('answer');
    quiz_answers[name] = (quiz_answers[name] ?? []).concat(answer);
    $(this).find('li').each(function() {
      let orig = $(this).html();
      if (orig.startsWith("(o)")) {
        let withoutRadio = orig.replace('(o)', '');
        $(this).html(withoutRadio);
        let v = $(this).text().trim();
        // console.log(`QUIZ: preparing answer ${v}`);
        let radio = jQuery('<input>', {
          'type': "radio",
          'name': name,
          'value': v
        });
        $(this).prepend(radio);
      }
      if (orig.startsWith("(x)")) {
        let withoutRadio = orig.replace('(x)', '');
        $(this).html(withoutRadio);
        let v = $(this).text().trim();
        // console.log(`QUIZ: preparing answer ${v}`);
        let checkbox = jQuery('<input>', {
          'type': "checkbox",
          'name': name,
          'value': v
        });
        $(this).prepend(checkbox);
      }
    });
  });
})
