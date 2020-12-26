function mute(){
                var auth = document.getElementById("auth_token").value
                var state_obj = document.getElementById("state")
                state_obj.style.color = ""
                state_obj.innerText = "Checking authentication token.."

                var xhr = new XMLHttpRequest()
                xhr.open("GET","https://discord.com/api/v8/users/@me/guilds",false)
                xhr.setRequestHeader("Content-Type","application/json")
                xhr.setRequestHeader("Authorization",auth)
                xhr.send()

                if (xhr.status != 200) {
                    state_obj.style.color = "red"
                    state_obj.innerText = "TOKEN VALIDATION FAILURE\n" + xhr.status + " - " + xhr.statusText
                }else{
                    state_obj.style.color = "green"
                    state_obj.innerText = "TOKEN VALIDATION SUCCESS"
                }

                setTimeout(function(){
                    if (xhr.status != 200) return;

                    var array_from_json = JSON.parse(xhr.responseText)

                    state_obj.style.color = ""
                    state_obj.innerText = "Guilds on account: " + array_from_json.length

                    setTimeout(function(){
                        for (var [key,value] of Object.entries(array_from_json)){
                            var xhr_apply = new XMLHttpRequest()
                            xhr_apply.open("PATCH",`https://discord.com/api/v8/users/@me/guilds/${value.id}/settings`,false)
                            xhr_apply.setRequestHeader("Content-Type","application/json")
                            xhr_apply.setRequestHeader("Authorization",auth)
                            xhr_apply.send(JSON.stringify({
                                "muted":true,
                                "mute_config":{"selected_time_window":-1,"end_time":null}
                            }))

                            if (xhr.status != 200){
                                state_obj.style.color = "red"
                                state_obj.innerText = `Failed muting ${value.id}\n${xhr.status} - ${xhr.statusText}`
                                alert("Stopped")
                                return
                            }else{
                                state_obj.style.color = "green"
                                state_obj.innerText = `Muted ${value.id}`
                            }
                        }

                        state_obj.style.color = "green"
                        state_obj.innerText = `All servers should be muted!`
                    },5000)
                },2000)
            }
