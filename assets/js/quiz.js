let learntrack_quiz = {
  api_key: "asdf",
  userJwt: "",
  quiz_answers: {},

  groupMap: (groupKey, mapKey) => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const key = obj[groupKey]
      const value = obj[mapKey]
      objectsByKeyValue[key] = (objectsByKeyValue[key] || []).concat(value)
      return objectsByKeyValue
    }, 
  {}),

  submitQuiz: function(ev) {
    ev.preventDefault()
    let frm = $(this)
    let quizName = frm.find('ol').attr('name')
    let data = frm.serializeArray()
    let grouped = learntrack_quiz.groupMap('name', 'value')(data)
    let correct = Object.keys(grouped).filter(nm => JSON.stringify(learntrack_quiz.quiz_answers[nm] ?? []) == JSON.stringify(grouped[nm]))
    let num_answers = Object.keys(learntrack_quiz.quiz_answers).length
    let num_correct = correct.length
    let response = {
      name: quizName,
      value: (num_correct * 100 / num_answers)
    }
    $.ajax({
      url: visiting.lt_home + "achieve",
      headers: { 
        "Authorization": `Bearer ${learntrack_quiz.userJwt}`,
        "X-API-KEY": learntrack_quiz.api_key
      },
      method: "POST",
      data: JSON.stringify(response)
    })
  },
  prepareQuiz: function(){
    // console.log("QUIZ: Preparing")
    var frm = $('.pageContent > ol').wrap('<form id="quizform"></form>')
    frm = $('#quizform')
    frm.submit(learntrack_quiz.submitQuiz)
    frm.append('<input type="submit"/>')
    $('.pageContent form > ol > li > ol').each(function() {
      let container = $(this)
      let name = container.attr('name')
      let answer = container.attr('answer')
      // console.log(`QUIZ: Preparing question ${name}`)
      container.removeAttr('name')
      container.removeAttr('answer')
      learntrack_quiz.quiz_answers[name] = (learntrack_quiz.quiz_answers[name] ?? []).concat(answer)
      $(this).find('li').each(function() {
        let orig = $(this).html()
        if (orig.startsWith("(o)")) {
          let withoutRadio = orig.replace('(o)', '')
          $(this).html(withoutRadio)
          let v = $(this).text().trim()
          // console.log(`QUIZ: preparing answer ${v}`)
          let radio = jQuery('<input>', {
            'type': "radio",
            'name': name,
            'value': v
          })
          $(this).prepend(radio)
        }
        if (orig.startsWith("(x)")) {
          let withoutRadio = orig.replace('(x)', '')
          $(this).html(withoutRadio)
          let v = $(this).text().trim()
          // console.log(`QUIZ: preparing answer ${v}`)
          let checkbox = jQuery('<input>', {
            'type': "checkbox",
            'name': name,
            'value': v
          })
          $(this).prepend(checkbox)
        }
      })
    })
  }
}

$(document).ready(learntrack_quiz.prepareQuiz)
