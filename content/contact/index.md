---
title: 'Contact Us'
date: 2019-06-01T23:24:35-04:00
menu: main
weight: 30
description: 'Meta Description about the Contact Page'
---

<section class="section">
<div class="container contact-us">
    <form action="">
        <div class="columns">
            <div class="column is-half">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" required="true">
            </div>
            <div class="column is-half">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required="true">
            </div>
        </div>
        <div class="columns">
            <div class="column is-full">
                <label for="message">Message</label>
                <textarea cols="30" rows="4" name="message" id="message" required="true"></textarea>
            </div>
        </div>
        <div class="columns">
            <div class="column is-full">
                <input type="submit" value="Get In Touch" class="button is-primary contact-us__btn">
            </div>
        </div>
    </form>
</div>
</section>