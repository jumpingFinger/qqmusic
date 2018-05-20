let musicRender = (function () {
    let $headerBox = $('.headerBox'),
        $contentBox = $('.contentBox'),
        $footerBox = $('.footerBox'),
        $wrapper = $contentBox.find('.wrapper'),
        $lyricList = null,
        curHeight=null,
        musicAudio = $('#musicAudio')[0],
        $playBtn = $headerBox.find('.playBtn'),
        $already = $footerBox.find('.already'),
        $duration = $footerBox.find('.duration'),
        $current = $footerBox.find('.current');
    let $plan = $.Callbacks();

    //=>计算出中间歌词部分的高度,来维持整个页面的结构
    let computedContent = function () {
        //=>$(document) document不需要让双引号包起来
        let winH = $(document).height(),
            font = parseFloat(document.documentElement.style.fontSize);
        $contentBox.css({
            height: winH - $headerBox.height() - $footerBox.height() - 0.8 * font
        });
    };

    //=>对歌词的处理
    let queryData = function () {
        return new Promise((resolve) => {
            $.ajax({
                url: 'json/lyric.json',
                method: 'get',
                dataType: 'json',
                async: true,
                success: resolve
            })
        })
    };
    let formatData = function ({lyric}='') {
        let obj = {30: ' ', 40: '(', 41: ')', 45: '-'};
        lyric=lyric.replace(/&#(\d+)/g,function (item,num){
            return obj[num] || item
        });
        return lyric;
    };
    let getData=function (lyric){
        let ary=[],
            reg=/\[(\d+)&#58;(\d+)&#46;\d+\]([^&#]+)(?:&#10;)?/g;
        lyric.replace(reg,function (...arg){
            let [, minutes, seconds, content] = arg;
            ary.push({minutes,seconds,content});
        });
        return ary;
    };

    //=>绑定歌词到页面中
    let bindHTML=function (ary){
        let str=``;
        ary.forEach(({minutes,seconds,content})=>{
            str += `<p data-minutes="${minutes}" data-seconds="${seconds}">${content}</p>`;
        });
        $wrapper.html(str);
        $lyricList=$wrapper.find('p');
        curHeight=$lyricList.eq(0).height();
    };

    //=>绑定完歌词播放音乐
    let playRun=function (){
        let timer=setTimeout(()=>{
            clearTimeout(timer);
            musicAudio.play();
            musicAudio.addEventListener('canplay',$plan.fire());
        },1000);
        /*关于audio标签的属性,事件下去查查*/
    };

    let myPlan=function () {
        let autoTimer=null;
        let translateY = 0;
        let computedTime = function (time) {
            let minutes = Math.floor(time / 60),
                seconds = Math.floor(time - minutes * 60);
            minutes < 10 ? minutes = '0' + minutes : null;
            seconds < 10 ? seconds = '0' + seconds : null;
            return minutes + ':' + seconds;
        };

        //=>计划表部分:音乐开始播放的时候要绑定的功能
        /*1:是暂停还是播放,控制图标是否执行动画(转动)*/
        let controlIsPause=function (){
            $playBtn.css('display','block').addClass('move');
            $playBtn.tap(()=>{
                if(musicAudio.paused){
                    musicAudio.play();
                    $playBtn.addClass('move');
                    return ;
                }
                musicAudio.pause();
                $playBtn.removeClass('move');
            });

        };
        $plan.add(controlIsPause);

        /*2. 同步进度条,同步歌词*/
        let syncProgress=function (){
            //1.总时间
            let duration = musicAudio.duration,
                allTime=computedTime(duration);
            $duration.html(allTime);
            //2.1秒监听一次动作条
            autoTimer=setInterval(()=>{
                let currentTime = musicAudio.currentTime,
                    curTime=computedTime(currentTime);
                if (currentTime>=duration){
                    /*当播放完的时候:1.两个时间计时器都变为最终事件
                    * 2.把控制条变为 100%
                    * 3.清除定时器
                    * */
                    $already.html(allTime);
                    $current.css('width','100%');
                    clearTimeout(autoTimer);

                    /*播放完成还要暂停音乐么???清除控制按钮*/
                    musicAudio.pause();
                    $playBtn.removeClass('move');
                    return
                }
                $already.html(curTime);
                $current.css('width', currentTime / duration * 100 + '%');
                matchLyric(curTime);
            },1000);

        };
        $plan.add(syncProgress);

        /*3.定时器里同步歌词*/
        let matchLyric=function (curTime){
            let [minutes,seconds]=curTime.split(':');
            let $curP=$lyricList.filter(`[data-minutes="${minutes}"][data-seconds="${seconds}"]`);
            if ($curP.length === 0) return;
            // if($curP.hasClass('active')) return;
            let index = $curP.index();
            $curP.addClass('active')
                .prev().removeClass('active');
            if(index>4){
                translateY -=curHeight;
                $wrapper.css('transform', `translateY(${translateY}px)`);
            }
        };
    };
    return {
        init: function () {
            computedContent();
            myPlan();
            let promise = queryData();
            promise.then(formatData)
                .then(getData)
                .then(bindHTML)
                .then(playRun);
        }
    }
})();
musicRender.init();